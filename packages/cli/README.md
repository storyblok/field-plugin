# Storyblok Field Plugin CLI
The Storyblok Field Plugin Command Line Interface provides functionality to create and deploy your field plugins in a much smoother and more intuitive way. Sometimes you might want to create only a single field plugin. At other times you might want to create and maintain multiple field plugins all in one repository. In both cases we have got you covered. The CLI supports both a single package and a monorepo setup. To get started, use the following command:


## :electric_plug: Installation
You can add the CLI to the project dependencies by running: 
```bash
yarn add @storyblok/field-plugin-cli
```

## Usage
In case no command is present the CLI will default to the `create` command.
```bash
yarn field-plugin [options] [command]
# or
npx field-plugin@latest [options] [command]
```
Available options and commands:
```bash
Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  create [options]  creates a new repository to start developing field plugins
  deploy [options]  deploys your selected plugin to Storyblok
  add    [options]  adds new field-plugin inside your project
  help   [command]  display help for command

```

### create
The `create` command allows a set of options for customization:

```bash
--dir <value>         directory to create a repository into (default: `.`)
--name <value>        name of plugin (Lowercase alphanumeric and dash)
--template <value>    name of template to use (choices: "vue2")
--structure <value>   setup structure (choices: "single", "multiple")
-h, --help            display help for command
```

### add
The options for the `add` command are the following:

```bash
--template <value>  name of template to use (choices: "vue2")
--name <value>      name of plugin (Lowercase alphanumeric and dash)
--dir <value>       directory to create a field-plugin into (default: `.`)
-h, --help          display help for command
```

### deploy
Uploading your field plugin implementation to Storyblok Partner Portal can be performed by simply running the `deploy` command.

:warning: A token to access the [Storyblok Management API](https://www.storyblok.com/docs/api/management) for upserting the field plugin **must** be provided. There are two ways how to pass a token to the CLI. :warning:

1. provide `--token <STORYBLOK_PERSONAL_ACCESS_TOKEN>` inside the `deploy` command
2. inside `.env` or `.env.local` create a new variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` 

For additional customizations you can add the following options to the command:

```bash
--token <value>       Storyblok personal access token
--skipPrompts         deploys without prompts (default: false)
--output <value>      defines location of the built output file
--dir <value>         path to field plugin to be deployed (default: ".")
--chooseFrom <value>  path to where all field plugin are located in a monorepo setup
-h, --help            display help for command
```

## :people_hugging: Supported Frameworks
We are working on providing templates for the popular frontend frameworks. Currently, our CLI includes templates created with:

- Vue 2


[//]: # (CI/CD - provide examples for how to setup a flow for ci/cd)

## :books: What's next?
Now that everything is set up you can go ahead and checkout Storyblok's resource on field plugins:

 🔗 [Field Plugin Documentation](https://www.storyblok.com/docs/plugins/field-type)

🔗 [Field Plugin Examples](https://github.com/storyblok/field-type-examples)

🔗 [Webinar Feature Focus: Field Plugin](https://www.youtube.com/watch?v=fvTWZCACDVQ)

## :seedling: Contributing
We are always looking for feedback to create a better developer experience. If you happen to find a bug or simply would like to suggest a new feature, you can do so by [submitting an issue](https://github.com/storyblok/field-plugin/issues).

## :construction: Roadmap
In the future, we would like to add more functionality to the CLI such as:
- [ ] Templates for Vue 3, React
- [ ] Support for different package managers (npm, pnpm)
- [ ] Initializing git when creating a new field plugin and + option to opt out
