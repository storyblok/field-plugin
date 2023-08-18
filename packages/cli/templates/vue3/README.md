# Storyblok Vue 3 Field Plugin

This project was created using Vue 3 and Typescript. It consists of a set of base functionalities, such as value updating, modal toggling and asset selection. This starter is intended to help developers when creating their own Storyblok Field Plugin.

## Composition API vs Options API

You can choose either option. This template is written using the Composition API, and you can view the implementation in the `src/useFieldPlugin.ts` file.

If you prefer to use the Options API, you can refer to [the Vue 2 template](https://github.com/storyblok/field-plugin/blob/main/packages/cli/templates/vue2/src/App.vue).

## Usage

For development, run the application locally with

```shell
npm run dev
```

and open the [Sandbox](https://plugin-sandbox.storyblok.com/field-plugin/).

To build the project, run

```shell
npm run build
```

Deploy the field plugin with the CLI. Issue a [personal access token](https://app.storyblok.com/#/me/account?tab=token), rename `.env.local.example` to `.env.example`, open the file, set the value `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and run

```shell
npm run deploy
```

## Next Steps

Read more about field plugins [on GitHub](https://github.com/storyblok/field-plugin).

Set up continuous integration with the [CLI](https://www.npmjs.com/package/@storyblok/field-plugin-cli). Define an environmental variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and use the `--name` and `--skipPrompts` options as such:

```shell
npm run deploy --name $NAME --skipPrompts
```

[@storyblok/design-system](https://www.npmjs.com/package/@storyblok/design-system) is Storyblok's component library for Vue. To add it to this project, follow the instructions in the [readme](https://www.npmjs.com/package/@storyblok/design-system).

## Clean up the boilerplate

To start from a blank state, replace the example component `<FieldPluginExample />` from `src/App.vue` with `<FieldPlugin />`.
