
# Test Crawler

**Description**:  Test Crawler is a tool made to build json file or output json to standard output out of project source code  
that describes test functions and corresponding scenarios   

## Configuration  

clone repository that should be annotated  

Create or update config.yaml to suite your needs.  
Config propperties:  
*name* - name or list of names of repositories that will be stored in destination folder for annotation parsing  
*origin* - remote git origin used for cloning or pulling changes  
*mode* - origin or local.  
*destination* - Destination specifies the output folder for origin  
*output* - save TC output to json or print it on stdout  
*lang_mode* - which language to parse (or auto for automatic detection and parsing)  

lang_mode options:  
* auto  - applies parser based on file extension  
* cpp  
* csharp  
* c  
* elm  
* golang  
* java  
* lua  
* ocaml  
* python  
* ruby  
* rust  
* typescript  

## Usage

`make run`  - runs test crawler 
   
----
Current annotation format examples:  
header:     //stm: #integration  
behavior:   //stm: @TEST_BEHAVIOR_T1, @TEST_BEHAVIOR_T2  
ignore:     //stm: ignore  

header goes as first line in source file before package clause  
if source file needs to be ignored, ignore flag also goes  
before package clause. The order of annotations doesn't mater  

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