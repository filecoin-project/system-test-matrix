# Dashboard-scripts

Complementary project made to extract data from **Filecoin** repository.

To build and run execute the following:
``` 
make init
make run
```
`make init` will clone filecoin repository (or pull changes if it already exists) in _modules directory  
It will also pull spec-actors  
`make run` outputs *json* file in outputs directory  