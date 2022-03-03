# CircleCI scraper

The scraper "scrapes" lotus tests and their statuses from the latest CI pipeline, using the CircleCI API, and outputs them to stdout.

- You can run it using `go run circleci_scraper.go`
- If you want to save the results to a file, you can just do `go run circleci_scraper.go > ci.json`

