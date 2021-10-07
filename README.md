# Filecoin System Test Matrix

> 💊😎 The "Red Pill" for Filecoin node implementations

The Filecoin System Test Matrix is a dashboard with a detailed list of Filecoin features and behaviors and a mapping between those features and test suites, systems and subsystems that those features are related to.

The main goal of this project is closing the discrepancy between specification and the actual state of implementations.

- The official resource for the expected behavior of Filecoin node implementations is the Filecoin Specification [^1]. It is written as *prose* and it's quite verbose (*and that's the way it should be*).
- The System Test Matrix can be used to evaluate the state of Filecoin node implementations (such as lotus [^2], venus [^3] etc) *at a glance* and help new contributors understand how the Filecoin network works. 

## How it works?

Here's the (simplified) lifecycle flow for the System Test Matrix:

1. Filecoin contributors with domain knowledge write new behaviors (test scenarios) and submit them via a PR to this repository. The features are enumerated inside one or more large YAML files. Every scenario has an unique ID.
2. The Test Crawler™️® (jk no trademark 🙂) scans the repository for tests and parses test annotations (written in our custom format) that map test functions to test behaviors from the previous step. It outputs a JSON report.
3. After the PR is reviewed and accepted, the data resulting from Step 1 and Step 2 is parsed and rendered into the **System Test Matrix** -- a rich UI where you can explore the full database of behaviors and tests and perform various queries and visualizations.

## The Data Model

![ER Diagram](diagrams/ER.png)

## Test Annotations
### File-Level annotations
File-Level annotations are comments at the top of your `_test.go` files.

The expected format is: `//stm:tags=...;ignore=...`

- Examples of tags are: `unit`, `integration`, `cli`, `api` ...
- Ignore can be `true` or `false`. If true, the crawler will skip this file.
- Mind that there is **no whitespace** between `//` and `stm`. This is a go convention for comments that are not meant to be read by humans.
- **Example:** `//stm:tags=integration,api;ignore=false`

### Function-Level annotations
Function-Level annotations are comments above your `TestSomething(t *testing.T)` functions.

The expected format is: `//stm:scenarios=...;ignore=...`

- Scenarios are a list of scenario IDs.
- Ignore can be `true` or `false`. If true, the crawler will skip this test case.
- **Example:** `//stm:scenarios=VOUCH_CREATE_001,PAYCH_ALLOC_001;ignore=false`

## Contributing

- To generate diagrams from PlantUML files use: `make diagrams`
- To contribute to the Test Crawler see the [Test Crawler README](test-crawler/README.md).
- To contribute to the Frontend see the [Frontend README](frontend/README.md)

---
[^1]: https://spec.filecoin.io/
[^2]: https://github.com/filecoin-project/lotus
[^3]: https://github.com/filecoin-project/venus
[^4]: https://spec.filecoin.io/#section-systems.filecoin_files.piece.data-representation