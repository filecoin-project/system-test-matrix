

init:
	mkdir -p _modules
	mkdir -p _local_modules
	if cd _modules/lotus; then git pull; else git clone https://github.com/filecoin-project/lotus/ _modules/lotus; fi
	if cd _modules/specs-actors; then git pull; else git clone https://github.com/filecoin-project/specs-actors/ _modules/specs-actors; fi

run_origin: init
	go run *.go

run: 
	go run *.go