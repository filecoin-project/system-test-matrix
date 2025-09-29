# Filecoin System Test Matrix

> 💊😎 The "Red Pill" for Filecoin node implementations

The Filecoin System Test Matrix is a dashboard with a detailed list of Filecoin features and behaviors and a mapping between those features and test suites, systems and subsystems that those features are related to.

The main goal of this project is closing the discrepancy between specification and the actual state of implementations.

- The _official_ resource for the expected behavior of Filecoin node implementations is the Filecoin Specification [^1]. It is written as _prose_ and it's quite verbose (_and that's the way it should be_).
- The System Test Matrix can be used to evaluate the state of Filecoin node implementations (such as lotus [^2], venus [^3] etc) _at a glance_ and help new contributors understand how the Filecoin network works.

## Components

### Behavior Catalog

Filecoin contributors with domain knowledge write new behaviors (test scenarios) and submit them via a PR to this repository. The features are enumerated inside one or more large YAML files. Every scenario has an unique ID.

The default location of the catalog is: `frontend/apps/web/scripts/data`.

The catalog has it's own [README file](frontend/apps/web/scripts/data/README.md)

### Test Crawler

The Test Crawler™️® (jk no trademark 🙂) scans the repository for tests and parses test annotations (written in our custom format) that map test functions to test behaviors from the previous step. It outputs a JSON report.

💡 TIP: By default, the UI expects the crawler results to be placed at `frontend/apps/web/src/tests.json`

The Test Crawler has it's own [README file](test-crawler/README.md).

### UI (System Test Matrix)

The **System Test Matrix** is a rich UI where you can explore the full database of behaviors and tests and perform various queries and visualizations.

The UI has it's own [README file](frontend/README.md)

### CI scraper

The scraper "scrapes" lotus tests and their statuses from the latest CI pipeline, using the CircleCI API, and outputs them to stdout.

💡 TIP: By default, the UI expects the scraper results to be placed at `frontend/apps/web/src/ci.json`

The CI scraper has it's own [README file](scraper/README.md)

## Deployments

- Lotus System Test Matrix: https://lotus.systemtestmatrix.com/
- Venus System Test Matrix: https://venus.systemtestmatrix.com/

---

[^1]: https://spec.filecoin.io/
[^2]: https://github.com/filecoin-project/lotus
[^3]: https://github.com/filecoin-project/venus
[^4]: https://spec.filecoin.io/#section-systems.filecoin_files.piece.data-representation
