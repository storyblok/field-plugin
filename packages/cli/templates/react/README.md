# Storyblok Field Plugin in React

This React project is designed to function as a Storyblok field plugin application. It showcases some fundamental features for field plugins, including value updates, modal toggling, and asset selection. The primary goal of this starter is to provide developers with a clear blueprint for creating custom field plugins.

To remove the example code, simply delete the `src/components/` directory and alter the imports and returned `JSX` in `src/App.tsx`.

For those who prefer to work with JavaScript instead of TypeScript, they can rename src/App.tsx to src/App.jsx.

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

The manifest file is a configuration that enhances the functionality of your field plugin. This JSON file, named `field-plugin.config.json` and located in your project's root folder, is optional but highly recommended.

The manifest file allows you to configure [options](https://www.storyblok.com/docs/plugins/field-plugins/introduction#options) for your field plugin. When developing your field plugin with the [Sandbox](https://plugin-sandbox.storyblok.com/field-plugin/), the options are applied by default. Also, the deploy command automatically applies the options in production. So, you no longer need to configure the options manually.

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

Now, you just need to access these options in your code like in the example below:

```js
const { type, data, actions } = useFieldPlugin()

console.log(data.options.myPluginInitialValue)
```

## Next Steps

Read more about field plugins [on GitHub](https://github.com/storyblok/field-plugin).

Set up continuous integration with the [CLI](https://www.npmjs.com/package/@storyblok/field-plugin-cli). Define an environmental variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and use the `--name` and `--skipPrompts` options as such:

```shell
npm run deploy --name $NAME --skipPrompts
```

[@storyblok/mui](https://www.npmjs.com/package/@storyblok/mui) contains a component library and theme for [MUI](https://mui.com/). To add it to this project, follow the instructions in the [readme](https://github.com/storyblok/mui).

## Clean up the boilerplate

To start from a blank state, remove the example component `<FieldPluginExample />` from `src/App.tsx` with `<FieldPlugin />`.
