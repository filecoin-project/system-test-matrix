# Mono

> Monorepo containing filecoin's client-side code

## Intro

This repo utilizes `lerna` and `yarn workspaces` for all its monorepo needs.

Primary technologies include:

- [TypeScript](https://typescriptlang.org)
- [React](https://reactjs.org/docs/getting-started.html)
- [Styled Components](https://styled-components.com/docs)
- [Jest](https://jestjs.io/docs/en/getting-started)
- [Cypress](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file)

## Getting started

After cloning the repo, run `yarn` inside the repo root.
The repo is organized into `apps/` and `packages/`. `packages/` contain all re-usable code across the codebase, while `apps/` contain all applications.

We handle environment variables in `.env` files with default values in each `app`'s folder, i.e. `apps/web/env` contains `local.env`, `staging.env` and `production.env` that contain default values for specified environments. If the repo is freshly cloned, you can copy each `app`'s `local.env` file to the `app`'s root folder as `.env` - f.e. `cp apps/web/env/local.env apps/web/.env`

Each app has a `serve` and `build` npm script and by utilising `lerna` we can build all apps in parallel by running `yarn build` in the repository root, or spin up a development server `yarn serve`

Summary
1. Install node.js https://www.webucator.com/how-to/how-install-nodejs-on-mac.cfm or run in Terminal: `brew install node`
2. run in Terminal command: `npm install --global yarn`
3. `git clone https://github.com/filecoin-project/system-test-matrix.git`
4. in frontend folder run command: `yarn && yarn lerna bootstrap`
5. rename "frontend/apps/web/.env.example" - .env.example => .env
6. run command: `yarn serve` in frontend folder

#### **NOTE: Required node version to run this project is node 14 or node 16.**

## Code guidelines

We use ESLint for linting and Prettier for formatting our code, specifics can be seen in respective configs.

