# Storyblok Field Plugin CLI
[//]: # (TBD Add storyblok social media and package links)

The Storyblok Field Plugin Command Line Interface provides functionality to create and deploy your field plugins in a much smoother and more intuitive way. To get started, use the following command:

## Usage
In case no command is present the CLI will default to the `create` command.

[//]: # (TBD: add yarn create as soon as it is implemented)

```bash
npx @storyblok/field-plugin-cli@alpha [command] [options]
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
[//]: # (TBD Add GIF with interactive mode)

### create
The `create` command allows a set of **optional** options for customization.

```bash
--dir <value>         directory to create a repository into (default: `.`)
--name <value>        name of plugin (Lowercase alphanumeric and dash)
--template <value>    name of template to use (choices: "vue2")
--structure <value>   setup structure (choices: "polyrepo", "monorepo")
-h, --help            display help for command
```

#### Examples
```bash
# Run this simple command and you will be prompted to provide all required information
npx @storyblok/field-plugin-cli

# Create a single field plugin with Vue 2 template inside a specific directory with a specific named
npx @storyblok/field-plugin-cli create --dir=<PATH_TO_DIR> --name=<FIELD_PLUGIN_NAME> --template=vue2 --structure=polyrepo

# Create a monorepo with field plugin with a specific named inside a specific directory with Vue 2 template
npx @storyblok/field-plugin-cli create --dir=<PATH_TO_DIR> --name=<FIELD_PLUGIN_NAME> --template=vue2 --structure=monorepo
```

#### Structure
Sometimes you might want to create only a single field plugin. At other times you might want to create and maintain multiple field plugins all in one repository. In both cases we have got you covered. The CLI supports both a polyrepo and a monorepo setup.

##### polyrepo (one package in one repo)
Here is a simplified folder structure of a polyrepo mode:
```bash
├── field-plugin
│   ├── src
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   └── ...
└──
```

#### monorepo (multiple packages in one repo)
For a monorepo setup, we are using the following project structure:
```bash
├── field-plugins
│   ├── packages
│   │   ├── field-plugin
│   │   │   ├── src
│   │   │   ├── index.html
│   │   │   ├── package.json
│   │   │   ├── README.md
│   │   │   └── ...
│   │   └── ...
│   ├── README.md
│   └── package.json
└── ...
```
[//]: # (TBD Add GIF with interactive mode)

### add
The options for the `add` command are the following:

```bash
--template <value>  name of template to use (choices: "vue2")
--name <value>      name of plugin (Lowercase alphanumeric and dash)
--dir <value>       directory to create a field-plugin into (default: `.`)
-h, --help          display help for command
```
#### Examples
```bash
# Run this simple command and you will be prompted to provide all required information
npx @storyblok/field-plugin-cli add

# Add field plugin with Vue 2 template to a project outside of the current directory
npx @storyblok/field-plugin-cli add --name=<FIELD_PLUGIN_NAME> --template=vue2 --dir=<PATH_TO_DIR>
```
[//]: # (TBD Add GIF with interactive mode)

### deploy
Uploading your field plugin implementation to Storyblok Partner Portal can be performed by simply running the `deploy` command.

[//]: # (Add information about deploy and what is specifically does - uploading content of a file to SB, not building)

>:warning: A token to access the [Storyblok Management API](https://www.storyblok.com/docs/api/management) for upserting the field plugin **must** be provided. There are two ways how to pass a token to the CLI.
> 1. provide `--token <STORYBLOK_PERSONAL_ACCESS_TOKEN>` inside the `deploy` command
> 2. inside `.env` or `.env.local` create a new variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` 

For additional customizations you can add the following options to the command:

```bash
--token <value>       Storyblok personal access token
--skipPrompts         deploys without prompts (default: false)
--output <value>      defines location of the built output file
--dir <value>         path to field plugin to be deployed (default: ".")
-h, --help            display help for command
```

#### Examples
```bash
# Run this simple command and you will be prompted to provide all required information. NOTE: This command will work only if you have created STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable inside .env or .env.local!
npx @storyblok/field-plugin-cli deploy

# Deploy your field plugin by providing a token
npx @storyblok/field-plugin-cli deploy --token=<TOKEN>

# When used in a CI/CD one might want to skip the input prompts. This can be achieved with the --skipPrompts flag
npx @storyblok/field-plugin-cli deploy --token=<TOKEN> --skipPrompts

# Deploy your field plugin from outside of the project
npx @storyblok/field-plugin-cli deploy --token=<TOKEN> --dir=<PATH_TO_DIR>
```

[//]: # (Add snippet for root script to deploy a package)

## :electric_plug: Installation
You can add the CLI to an existing field plugin project by running:
```bash
yarn add --dev @storyblok/field-plugin-cli@alpha
```

In case you want to access the dependency globally use:
```bash
yarn global add @storyblok/field-plugin-cli@alpha 
# or
npm install @storyblok/field-plugin-cli@alpha --global
```

[//]: # (TBD Add GIF with interactive mode)
## :people_hugging: Supported Frameworks
We are working on providing templates for the popular frontend frameworks. Currently, our CLI includes templates created with:
- React
- Vue 3
- Vue 2

## :books: What's next?
Now that everything is set up you can go ahead and checkout Storyblok's resource on field plugins:

🔗 [Field Plugin Documentation](https://www.storyblok.com/docs/plugins/field-type)

🔗 [Field Plugin Examples](https://github.com/storyblok/field-type-examples)

🔗 [Webinar Feature Focus: Field Plugin](https://www.youtube.com/watch?v=fvTWZCACDVQ)

## :seedling: Contributing
Please see our [contributing guidelines](https://github.com/storyblok/.github/blob/master/contributing.md). We are always looking for feedback to create a better developer experience. If you happen to find a bug or simply would like to suggest a new feature, you can do so by [submitting an issue](https://github.com/storyblok/field-plugin/issues).

## :1st_place_medal: Credits
Special thanks goes to all the people that contribute to this library!

<a href="https://github.com/storyblok/field-plugin/graphs/contributors">
  <img alt='contributors' src="https://contrib.rocks/image?repo=storyblok/field-plugin"/>
</a>

[//]: # (TBD provide information on semantic naming conventions for brnaches?)

## :construction: Roadmap
In the future, we would like to add more functionality to the CLI such as:
- [ ] Support for different package managers (npm, pnpm)
- [ ] Initializing git when creating a new field plugin and + option to opt out


[//]: # (TBD)
[//]: # (CI/CD - provide examples for how to setup a flow for ci/cd)
[//]: # (Known Limitations)