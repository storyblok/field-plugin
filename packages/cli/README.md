# Storyblok Field Plugin CLI
The Storyblok Field Plugin Command Line Interface provides functionality to create and deploy your field plugins in a much smoother and more intuitive way. Sometimes you might want to create only a single field plugin. At other times you might want to create and maintain multiple field plugins at once. In both cases we have got you covered. The CLI supports both a single package and a monorepo setup. To get started, use the following command:

## Create
You can create a new field plugin by running:

```bash
npx field-plugin@latest
# or
yarn field-plugin create
```

[//]: # (add gif with interactive ui)

for more customization you can use the following options:

```bash
--dir <value>         directory to create a repository into (default: `.`)
--name <value>        name of plugin (Lowercase alphanumeric and dash)
--template <value>    name of template to use (choices: "vue2")
--structure <value>   setup structure (choices: "single", "multiple")
-h, --help            display help for command
```

## Add
If you decide to add a new field plugin to your repository you can do so by running: 

```bash
npx field-plugin add
```
The options for the `add` command are the following:

```bash
--template <value>  name of template to use (choices: "vue2")
--name <value>      name of plugin (Lowercase alphanumeric and dash)
--dir <value>       directory to create a field-plugin into (default: `.`)
-h, --help          display help for command
```

## Deploy
Uploading your field plugin implementation to Storyblok Partner Portal can be performed by simply running the `deploy` command.

:warning: A token to access the Storyblok Managament API for upserting the field plugin **must** be provided. There are two ways how to pass a token to the CLI. :warning:

1. provide `--token <STORYBLOK_PERSONAL_ACCESS_TOKEN>` inside the `deploy` command
2. inside `.env` or `.env.local` create a new variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` 


```bash
npx field-plugin deploy
```
For additional customizations you can add the following options to the command:

```bash
--token <value>       Storyblok personal access token
--skipPrompts         deploys without prompts (default: false)
--output <value>      defines location of the built output file
--dir <value>         path to field plugin to be deployed (default: ".")
--chooseFrom <value>  path to where all field plugin are located in a monorepo setup
-h, --help            display help for command
```

## Supported Frameworks
We are working on providing templates for the popular frontend frameworks. Currently, our CLI includes templates created with:

- Vue 2

## CI/CD
[//]: # (TBD)

## :books: What's next?
Now that everything is set up you can go ahead and checkout Storyblok's resource on field plugins:

 🔗 [Field Plugin Documentation](https://www.storyblok.com/docs/plugins/field-type)

🔗 [Field Plugin Examples](https://github.com/storyblok/field-type-examples)

🔗 [Webinar Feature Focus: Field Plugin](https://www.youtube.com/watch?v=fvTWZCACDVQ)



## Roadmap