
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
*lang_mode* - work in progress    

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

## Test Annotations

Symboles used that preceed tags indicate what type of tag it is.
- `//stm: @` is used for function-level annotations
- `//stm: #` is used for file-level annotations
- `//stm: ignore` is special case for ignoring certain files/functions

The expected format is: `//stm: tag`

### File-Level annotations
File-Level annotations are comments at the top of your `_test.go` files.

- Examples of tags are: `#unit`, `#integration`, `#cli`, `#api` ...
- Files or functions can be ignored with `ignore` tag
- Mind that there is **no whitespace** between `//` and `stm`. This is a go convention for comments that are not meant to be read by humans.
- **Example:** `//stm: #integration`

### Function-Level annotations
Function-Level annotations are comments above your `TestSomething(t *testing.T)` functions.

The expected format is: `//stm @scenario`

- Scenarios are a list of scenario IDs.
- Ignore can be placed as comment on top of function. The crawler will skip this test case.
- **Example:** `//stm: @VOUCH_CREATE_001, @PAYCH_ALLOC_001`