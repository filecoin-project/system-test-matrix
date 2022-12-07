#!/bin/bash
go run . -crawl=src
# for FILE in "outputs/*"; do echo $FILE | cat $FILE; done
if [ -z "$(ls -A outputs)" ]; then
   echo "No expected files in output directory"
   exit 1
fi