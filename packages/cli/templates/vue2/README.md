# Storyblok Vue 2 Field Plugin

This project was created using Vue 2. It consists of a set of base functionalities, such as value updating, modal toggling and asset selection. This starter is intended to help developers when creating their own Storyblok Field Plugin.

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

## Manifest File for Field Plugins

The manifest file is a valuable component that enhances the functionality of your field plugin. This JSON file, named `field-plugin.config.json` and located in your project's root folder, is optional but highly recommended.

When this file is present, it empowers our CLI and build tools to efficiently access its contents, resulting in smoother deployment experiences.

Moreover, during the development phase, this manifest file plays a crucial role in the [Sandbox](https://plugin-sandbox.storyblok.com/field-plugin/). All the `options` defined within this file are automatically integrated, simplifying your workflow.

While most field plugins created using our templates include this manifest file, you may find that your custom plugin lacks it. In such cases, follow the steps below to easily set it up.

### Creating a Manifest File

If your field plugin doesn't already contain a manifest file, you can create one yourself at any time by following these steps:

1. Begin by creating a `field-plugin.config.json` file in the root folder of your project.
2. Populate the file with the following content:

```json
{
  "options": []
}
```

That's all there is to it.

The options list within this file should consist of key-value objects representing the essential options required for your field plugin to function correctly, along with their corresponding values. This is an example of how it should be structured:

```json
{
  "options": [
    {
      "name": "myPluginInitialValue",
      "value": 100
    }
  ]
}
```

By creating and maintaining this manifest file, you ensure that the CLI can effortlessly read and synchronize these options during each deployment. This streamlines the entire process, making your field plugin development more efficient and hassle-free.

## Next Steps

Read more about field plugins [on GitHub](https://github.com/storyblok/field-plugin).

Set up continuous integration with the [CLI](https://www.npmjs.com/package/@storyblok/field-plugin-cli). Define an environmental variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and use the `--name` and `--skipPrompts` options as such:

```shell
npm run deploy --name $NAME --skipPrompts
```

## Clean up the boilerplate

To start from a blank state, remove the example component `<FieldPluginExample />` from `src/App.vue` with `<FieldPlugin />`.
