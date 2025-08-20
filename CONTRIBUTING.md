# Contributing

Welcome to the Contributor Guide for the Field Plugin SDK. Here you'll find everything you need to get started in contributing to the SDK.

- [Reporting an issue](#reporting-an-issue)
- [Monorepo](#monorepo)
- [Commit conventions](#commit-conventions)
- [Creating Pull Request](#creating-pull-request)
- [Requirements](#requirements)
- [Projects](#projects)
  - [Library](#library)
  - [CLI](#cli)
  - [Templates](#templates)
  - [Helpers](#helpers)
- [Release](#release)

## Reporting an issue

If you've discovered a bug or have a feature request, please create [an issue](https://github.com/storyblok/field-plugin/issues/new/choose). Before submitting, please check if there's already an open issue related to it on [the issues page](https://github.com/storyblok/field-plugin/issues).

## Monorepo

This repository is a monorepo that includes multiple packages. We use Yarn Workspace to manage its structure.

- Library (`packages/field-plugin`): This is the core library. It exports the `createFieldPlugin()` function, which sends and receives events between Storyblok's Visual Editor and your Field Plugin.
- Demo (`packages/demo`): This is a demo Field Plugin that covers the basic functionalities of the Field Plugin SDK.
- Sandbox (`packages/sandbox`): In production, a Field Plugin is hosted within Storyblok's Visual Editor, and they exchange events. Similarly, our demo Field Plugin needs an environment like the Visual Editor. That's what the Sandbox is - a simulated container environment to test your Field Plugin.
- CLI (`packages/cli`): This is a CLI package that helps you create and deploy Field Plugins. It can be accessed with `npx @storyblok/field-plugin@beta`.
- Templates (`packages/cli/templates/*`): We maintain templates to create Field Plugin in React, Vue 3, Vue 2, and plain JavaScript.
- Helpers (`packages/helper-*`): While `createFieldPlugin` from `@storyblok/field-plugin` is framework-agnostic, we provide framework-specific helpers such as the `useFieldPlugin` hook. These helpers are not released independently to NPM, but are included within the library and accessible as a submodule, for example, `import { useFieldPlugin } from '@storyblok/field-plugin/react'`.

## Commit conventions

This repository follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

When a pull request is created, GitHub Actions check its title. Commits inside pull requests don't need to strictly adhere to the conventions. Once the pull request is approved, it will be squashed and merged into a single commit on the `main` branch.

Scopes we're using:

- common
- lib
- sandbox
- cli
- template
- demo

[See the setup →](https://github.com/storyblok/field-plugin/blob/main/.github/workflows/pr-title.yml)

## Creating Pull Request

> **Note**
> If you are an external contributor, please create an issue first, so that we can align on what should be included in the Field Plugin SDK before you invest your time and effort.

We strive to keep pull requests as small as possible to facilitate more effective feedback from reviewers. There is no set limit on the amount of changes, but if the reviewer feels the pull request is too large, they can request that the creator split it up.

## Requirements

- Node.js 22.18.0
- Yarn 3.2.4

> **Note**
> We are using these versions to develop our Field Plugin SDK. Consumers don't need to meet these requirements. Our boilerplates use [vite](https://vitejs.dev/), which handles browser compatibility automatically.

## Projects

Here are the projects in this monorepo, and how to set up and develop them.

### Library

#### Unit Tests

At the root of this repository, run the following command to run unit tests:

```sh
yarn test:lib
```

#### Test with demo and Sandbox

To test the library with a demo, you need to run three commands in parallel:

- `yarn dev:lib`: Watches file changes in the library and updates the bundle output.
- `yarn dev:demo`: Runs the demo Field Plugin located at `packages/demo`. Update it to test changes to the library.
- `yarn dev:sandbox`: Runs the Sandbox locally.

Run all the commands in three separate terminals, then open the Sandbox at `http://localhost:7070/`. This Container hosts the demo Field Plugin. Whenever you change a file in the library, the bundle output updates automatically and the demo app does Hot-Module Replacement (HMR). You can then seamlessly test it in the running Sandbox application.

### CLI

To test the CLI, make any changes under `packages/cli` and then run the following command.

```sh
yarn build:cli
```

To test the local version of the CLI, run `yarn dev:cli <command>`. It is recommended to test the CLI outside of the Field Plugin SDK repository. To do this, run the following:

```sh
yarn dev:cli create --dir ../<SOME-TEST-DIRECTORY>
```

A plugin will be created under the test directory.

The CLI package currently has few unit tests, but you can execute them as follows:

```sh
yarn test:cli
```

### Templates

#### Testing existing templates

If you want to try the React template, run this command:

```sh
yarn dev:react
```

You can also use the commands for other templates.

- dev:react
- dev:js
- dev:vue2
- dev:vue3

#### Adding a new template

We want to create a script to add a new template, but it's not available yet. So the process involves duplicating an existing template and modifying the code, particularly `vite.config.ts` for the build process.

Things to keep in mind when creating a new template include:

- Naming `gitignore` files without the dot (`gitignore`) as otherwise the file will be ignored by `npm publish`.
- Omitting `.env.local.example` as it will be copied from the `monorepo` template.
- Adding `dev:<template-name>` script inside the root `package.json` (e.g. `dev:react`, `dev:vue3`, etc)

### Helpers

This section will be filled once the helpers are shipped. Work is in progress.

## Release

> **Note**
> Only internal contributors can release the SDK.

You can release either `@storyblok/field-plugin` or `@storyblok/field-plugin-cli`. To begin the release process, run the following command on the `main` branch:

```sh
yarn bump-version
```

This will prompt you to select which package (`@storyblok/field-plugin` or `@storyblok/field-plugin-cli`) to release and the version number. After entering the required information, a pull request will be created automatically. This pull request will include changes in the `package.json` and possibly the `yarn.lock`.

Once this pull request is reviewed and merged, you'll get a commit like [this](https://github.com/storyblok/field-plugin/commit/b4bd948ce3d26f0905352ddbe474ebc9e2f89159).

Then, go to [Releases](https://github.com/storyblok/field-plugin/releases) and draft a new release:

- Create a tag with the format `<PACKAGE-NAME>@<VERSION>`; for example,  `@storyblok/field-plugin@0.0.1` and `@storyblok/field-plugin-cli@1.0.0-beta.2`
- Set the title to the same name.
- Generate release notes, and ensure that the content is accurate; for example, check that there are no missing bullet points, and check that library changes should not be listed in CLI release notes.

You can find a sample release [here](https://github.com/storyblok/field-plugin/releases/tag/%40storyblok%2Ffield-plugin-cli%400.0.1-beta.2).

Once a release is created, one of the two GitHub Actions—[.github/workflows/npm-publish-library.yml](https://github.com/storyblok/field-plugin/blob/main/.github/workflows/npm-publish-library.yml) or [.github/workflows/npm-publish-cli.yml](https://github.com/storyblok/field-plugin/blob/main/.github/workflows/npm-publish-cli.yml)—will run and deploy the corresponding package to npm.

### Order of releases

Typically, you should release `@storyblok/field-plugin` first. Then, upgrade the version within all the templates and release `@storyblok/field-plugin-cli` afterwards.

## Add someone as a contributor

This repository utilizes [all-contributors](https://allcontributors.org/) to acknowledge all contributors, regardless of the type of their contributions. In any Issue or Pull Request, you can leave comments in the following format:

```
@all-contributors please add @<username> for <contributions>
```

For instance:

```
@all-contributors please add @eunjae-lee for code.
```

The contribution types include `bug`, `code`, `example`, `ideas`, `test`, and more. You can find the complete list [in their documentation](https://allcontributors.org/docs/en/emoji-key).
