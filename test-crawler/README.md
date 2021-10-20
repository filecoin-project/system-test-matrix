
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
behavior:   //stm @TEST_BEHAVIOR_T1, @TEST_BEHAVIOR_T2

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
        "scenarios": [
            {
                "function": "TestDoesntDependOnBuild",
                "Behaviors": [
                    {
                        "behavior_id": "595dcc2a305993ee23de301a06ce7c99",
                        "behavior": "TEST_BEHAVIOR_14",
                        "ignore": false
                    },
                    {
                        "behavior_id": "a8097d71ad6638bd2e548df07e6297d4",
                        "behavior": "TEST_BEHAVIOR_15",
                        "ignore": false
                    },
                    {
                        "behavior_id": "38b993dc4547de2c66acdbadf65265d2",
                        "behavior": "TEST_BEHAVIOR_16",
                        "ignore": false
                    },
                    {
                        "behavior_id": "5b028f0c65a81667b39698b7b869f02a",
                        "behavior": "TEST_BEHAVIOR_17",
                        "ignore": false
                    },
                    {
                        "behavior_id": "f694532ec2bee806086638e8969f8d31",
                        "behavior": "TEST_BEHAVIOR_18",
                        "ignore": false
                    }
                ]
            }
}
```