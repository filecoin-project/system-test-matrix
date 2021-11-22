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
	"os"
	//	"testsuites/TestFile"
	//	"testsuites/Function"
	//	"testsuites/Scenario"
)

const circleCiApiEndpoint = "https://circleci.com/api/v2/"

// Initialize structures for scraping JSON data
// Hold the Pipelines extracted data. This is the only static URL that is going to be used.
type Pipelines struct {
	Items []struct {
		ID    string `json:"id"`
		State string `json:"state"`
		VCS   struct {
			Branch string `json:"branch"`
			//			Revision string `json:"revision"` // Might be used in future
		}
		Trigger struct {
			Type string `json:"type"`
		}
	}
}

// Hold the Workflows extracted data. IDs will be propagated for further use in scraping job statuses.
type Payload struct {
	Items []struct {
		ID     string `json:"id"`
		Name   string `json:"name"`
		Status string `json:"status"`
	}
}

// func testCrawlerResults() {

// }

func circleciApiCall(url string) []byte {
	req, _ := http.NewRequest("GET", url, nil)
	res, err := http.DefaultClient.Do(req)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	return body
}

func getPipelines(branch string) Pipelines {
	var pipelines Pipelines

	body := circleciApiCall(circleCiApiEndpoint + "project/gh/filecoin-project/lotus/pipeline?branch=" + branch)
	err := json.Unmarshal(body, &pipelines)

	if err != nil {
		fmt.Println(err)
	}

	return pipelines
}

func getWorkloads() Payload {
	var workflows Payload
	var body []byte
	pipelines := getPipelines("master") // Change to be passed as a command-line argument

	for i := range pipelines.Items {
		if pipelines.Items[i].Trigger.Type == "webhook" { // Only use the _ci_ workflows. Discuss nightly builds.
			body = circleciApiCall(circleCiApiEndpoint + "pipeline/" + pipelines.Items[i].ID + "/workflow") // Todo: maybe select a hash via command line
			break
		}
	}

	err := json.Unmarshal(body, &workflows)

	if err != nil {
		fmt.Println(err)
	}

	//	fmt.Println(workflows)
	return workflows
}

func getJobs() Payload {
	var jobs Payload

	workflows := getWorkloads()
	body := circleciApiCall(circleCiApiEndpoint + "workflow/" + workflows.Items[0].ID + "/job") // There should be only one item

	err := json.Unmarshal(body, &jobs)

	if err != nil {
		fmt.Println(err)
	}
	return jobs
}

func main() {
	fmt.Println(getJobs())
}
