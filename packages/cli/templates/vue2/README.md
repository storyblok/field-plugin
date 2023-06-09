# Storyblok Vue 2 Field Plugin

This project was created using Vue 2. It consists of a set of base functionalities, such as value updating, modal toggling and asset selection. This starter is intended to help developers when creating their own Storyblok Field Plugin.

## Usage

For development, run the application locally with

```shell
yarn dev
```

and open the [Sandbox](https://plugin-sandbox.storyblok.com/field-plugin/).

To build the project, run

```shell
yarn build
```

Deploy the field plugin with the CLI. Issue a [personal access token](https://app.storyblok.com/#/me/account?tab=token), rename `.env.local.example` to `.env.example`, open the file, set the value `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and run

```shell
yarn deploy
```

## Next Steps

Read more about field plugins [on GitHub](https://github.com/storyblok/field-plugin).

Set up continuous integration with the [CLI](https://www.npmjs.com/package/@storyblok/field-plugin-cli). Define an environmental variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and use the `--name` and `--skipPrompts` options as such:

```shell
yarn deploy --name $NAME --skipPrompts
```

## Clean up the boilerplate

To start from a blank state, remove the example component `<FieldPluginExample />` from `src/App.vue` with `<FieldPlugin />`.
