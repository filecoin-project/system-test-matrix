
# Test Crawler

**Description**:  Test Crawler is a tool made to build json file out of project source code  
that describes test functions and corresponding scenarios  
Currently its being built for Filecoin  

## Installation

Clone repository and run the following in your favorite terminal:  
``` 
make init
make run
```  

## Usage

`make init` will clone filecoin repository (or pull changes if it already exists) in _modules directory  
It will also pull spec-actors  
`make run` outputs *json* file in outputs directory  
   
----
Current annotation format examples:  
header:     //stm:header;type=integration;system=api;ignore=false  
scenario:   //stm:scen;code=SCEN_CODE_1, SCEN_CODE_34;ignore=false  

header goes as first line in source file  

----

### Example json output  

```javascript
{
        "file": "api_test.go",
        "path": "_modules/lotus/api/api_test.go",
        "repository": "lotus",
        "parent_folder": "api",
        "package": "api",
        "test_type": "integration",
        "system": "api",
        "ignore": false,
        "functions": [
            {
                "function": "TestDoesntDependOnFFI",
                "scenarios": [
                    {
                        "scenario_id": "370ea7be14c0084707f8470ffaf36e75",
                        "scenario_name": "list packages",
                        "behaviors": [
                            "TEST1",
                            "TEST2"
                        ],
                        "ignore": false
                    },
                    {
                        "scenario_id": "fb4e6f2cbf182aeb0bae8ad880eb5cbd",
                        "scenario_name": "check dependency on filecoin",
                        "behaviors": [
                            "TEST1",
                            "TEST2"
                        ],
                        "ignore": false
                    }
                ],
                "ignore": false
            }
}
```