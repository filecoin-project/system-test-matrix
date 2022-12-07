
run: 
	go run main.go config.go

copy-output:
	go run main.go config.go > ../frontend/apps/web/src/tests.json

run_bcg:
	go run . -crawl=src

go-unit-test:
	go test ./...

go-integration-test:
	./integrations_tests/*.sh