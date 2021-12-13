# System Behavior Catalogue

The goal of this "catalogue" is to enumerate and categorize all expected behaviors of a Filecoin Node implementation (primarily Lotus) and document them in a series of YAML files.

> You can think of it as a OpenAPI specification for your Behavior-Driven tests.

Ideally, anyone (e.g. *QA engineer*) wanting to test and validate if a Filecoin node is behaving as expected, should easily use this list to come up with good test scenarios.

This catalogue is a part of a suite of tools that are meant to be used together (but not necessary). Other important parts of the suite are:

- **The System Test Matrix Dashboard**: Web UI used to track and evaluate progress in your testing endeavors, e.g. "The Red Pill for Filecoin Node implementations" 💊 
- **The Test Crawler**: A small CLI tool that parses test files, looking for custom test annotation comments, creating a link between the catalogue, the dashboard and actual test files.

Here's a [video](https://www.youtube.com/watch?v=-ODA7hSgRcw&t=1662s) that explains the motivation behind this project.

## Important Disclaimers

- This does not replace a proper [specification](https://spec.filecoin.io/). The behavior catalogue doesn't care too much about internal implementation details, algorithms or the programming language used, it cares only about **expected behavior**. QA engineers should [test behavior, not implementation](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html). Ideally, this catalogue should be completely agnostic of the implementation, and useful for testing Lotus, Venus, Forest or any other "flavor" of a Filecoin node.
- This does not replace proper [user documentation](https://docs.filecoin.io/), since it does not specify in detail how to use a Filecoin node (cli parameters, config values etc).
- The quality of insights we get from the UI is directly dependent on the quality of this catalogue, so we need to make sure the catalogue is updated regularly, that it's *consistent*, *complete* and *correct*. *Content is king*.

## Catalogue Architecture

- A Filecoin node consists of multiple **Systems** - the highest architectural denomination of a node; Every system gets it's own directory inside of the root `systems` directory, for example: `systems/chain`, `systems/repo`, `systems/vm`. 
- A System contains one or more **Subsystems** - the 2nd level architectural denomination of a node; Every subsystem gets it's own YAML specification file, for example: `systems/chain/mempool.yml`, `systems/chain/state.yml`.
- Every Subsystem contains one or more **Features** - logical groupings of behaviors enumerated within the appropriate subsystem YAML file. For example: `chain/mempool.yml/Push`
- Every Feature contains one or more **Behaviors** uniquely identified by their IDs, for example `chain/mempool.yml/Push/CHAIN_MEMPOOL_PUSH_001`. Each behavior should easily be *translated* into a unique test scenario by a test engineer.

## Contributing

Just read the best practices below, and submit a PR to this repo. If you are unsure about the quality of your contribution, *just do it*, we won't judge. It's better to ask for forgiveness than permission. 🙂

> We need you! ❤️

Feedback on existing data is very welcome - we are *noobs* in the Filecoin ecosystem, and we are bound to make mistakes.

### Best practices

- Behavior IDs (usually) follow the convention `SYSTEM_SUBSYSTEM_FEATURE_COUNTER`, for example `chain/mempool.yml/Push/CHAIN_MEMPOOL_PUSH_001`. This is not strictly enforced, but uniqueness of IDs is, and a good way to avoid ID collision is to respect this convention.
- Behavior descriptions (usually) follow the BDD format: `Given <something>, return <something else>`, written in *imperative*. This is not strictly enforced since this format is best for standard user-facing applications, and some network/blockchain specific features are hard to describe using this format.
- If you sense that a specific feature you are describing doesn't fit into any of the existing systems/subsystems, feel free to create a new one.
- 