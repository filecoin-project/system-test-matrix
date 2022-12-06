#!/bin/bash
go run . -crawl=src
find "outputs" -type f -exec echo Found file {} \;
# for FILE in "outputs/*"; do echo $FILE | cat $FILE; done
if [ -z "$(ls -A outputs)" ]; then
   echo "Empty"
   exit 1
else
   echo "Not Empty"
fi