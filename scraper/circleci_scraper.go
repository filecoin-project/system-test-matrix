// The intention of this script is to scrape CircleCI for the existing Filecoin pipelines, workloads and jobs, and extract statuses of those jobs.
// The jobs pertain to the testing suite written for the purpose of maintaining proper code conduct.
// Todo:
//   - There might be a reason to create multiple API calls in a short time. In case this happens impement this: https://circleci.com/docs/2.0/api-developers-guide/#rate-limits
//   - Add support for GitHub hash-based selection
//   - Discuss whether `nightly` builds should be included

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

const circleCiApiEndpoint = "https://circleci.com/api/v2"
const circleCiUi = "https://app.circleci.com"
const circleCiProject = "github/filecoin-project/lotus"

type Pipeline struct {
	ID     string `json:"id"`
	State  string `json:"state"`
	Number int    `json:"number"`
	VCS    struct {
		Branch string `json:"branch"`
	}
	Trigger struct {
		Type string `json:"type"`
	}
}

type Workflow struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Status   string   `json:"status"`
	Pipeline Pipeline `json:"pipeline"`
}

type Job struct {
	JobNumber int      `json:"job_number"`
	ID        string   `json:"id"`
	Name      string   `json:"name"`
	Number    int      `json:"number"`
	Status    string   `json:"status"`
	Workflow  Workflow `json:"workflow"`
	URL       string   `json:"url"`
}

// Hold the job's tests metadata.
type Test struct {
	Name      string `json:"name"`
	ClassName string `json:"classname"`
	Results   string `json:"result"`
	Source    string `json:"source"`
	Job       Job    `json:"job"`
}

func circleciApiCall(endpoint string) []byte {
	url := fmt.Sprintf("%s/%s", circleCiApiEndpoint, endpoint)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		panic(err)
	}

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	return body
}

func getPipelines(branch string) []Pipeline {
	body := circleciApiCall(fmt.Sprintf("project/%s/pipeline?branch=%s", circleCiProject, branch))

	var response struct {
		Pipelines []Pipeline `json:"items"`
	}

	err := json.Unmarshal(body, &response)
	if err != nil {
		panic(err)
	}

	return response.Pipelines
}

func getCiWorkflow(pline Pipeline) Workflow {
	var response struct {
		Workflows []Workflow `json:"items"`
	}

	body := circleciApiCall(fmt.Sprintf("pipeline/%s/workflow", pline.ID))

	err := json.Unmarshal(body, &response)

	if err != nil {
		panic(err)
	}

	if len(response.Workflows) != 1 {
		panic(fmt.Sprintf("expected exactly one CI workflow, received: %v", response.Workflows))
	}

	ci := response.Workflows[0]
	ci.Pipeline = pline

	return ci
}

func getJobs(wf Workflow) []Job {
	var response struct {
		Jobs []Job `json:"items"`
	}

	body := circleciApiCall(fmt.Sprintf("workflow/%s/job", wf.ID)) // There should be only one item

	err := json.Unmarshal(body, &response)
	if err != nil {
		panic(err)
	}

	for i := range response.Jobs {
		response.Jobs[i].Workflow = wf
	}

	return response.Jobs
}

func getTests(job Job) []Test {
	var response struct {
		Tests []Test `json:"items"`
	}

	body := circleciApiCall(fmt.Sprintf("project/%s/%d/tests", circleCiProject, job.JobNumber))

	err := json.Unmarshal(body, &response)
	if err != nil {
		panic(err)
	}

	for i := range response.Tests {
		response.Tests[i].Job = job
	}

	return response.Tests
}

func formatJobURL(job Job) string {
	return fmt.Sprintf(
		"%s/pipelines/%s/%d/workflows/%s/jobs/%d/tests",
		circleCiUi,
		circleCiProject,
		job.Workflow.Pipeline.Number,
		job.Workflow.ID,
		job.JobNumber,
	)
}

func scrape(branch string) []Test {
	// get all pipelines for branch, sorted by latest desc
	plines := getPipelines(branch)

	// find the latest, webhook pipeline
	var whPline *Pipeline
	for i := 0; i < len(plines) && whPline == nil; i++ {
		if plines[i].Trigger.Type == "webhook" {
			whPline = &plines[i]
		}
	}

	// get the CI workflow for the webhook pipeline
	ci := getCiWorkflow(*whPline)

	// get jobs for the CI workflow
	jobs := getJobs(ci)

	// get tests for each job, and form job url
	var tests []Test
	for i := range jobs {
		jobs[i].URL = formatJobURL(jobs[i])
		tests = append(tests, getTests(jobs[i])...)
	}

	return tests
}

func main() {
	tests := scrape("master")

	out, err := json.MarshalIndent(tests, "", " ")
	if err != nil {
		panic(err)
	}

	fmt.Printf("%s\n", out)
}
