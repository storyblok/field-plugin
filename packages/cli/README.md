# Storyblok Field Plugin CLI
The Storyblok Field Plugin Command Line Interface provides functionality to create and deploy your field plugins in a much smoother and more intuitive way. Sometimes you might want to create only a single field plugin. At other times you might want to create and maintain multiple field plugins at once. In both cases we have got you covered. The CLI supports both a single package and a monorepo setup. To get started, use the following command:

## Create
You can create a new field plugin by running:

```bash
npx field-plugin
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
### Supported Frameworks
We are working on providing templates for the biggest frontend frameworks. Currently, our CLI includes:

- Vue 2

## Add


## Deploy

## CI/CD


## Next Steps

[//]: # ( share resources for field types - documentation or articles or dev guides)

## Roadmap