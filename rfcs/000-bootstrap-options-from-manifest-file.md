- Start Date: 2023-08-28
- Target Major Version: 1.X
- Reference Issues:
- Implementation PR:

# Summary

Describes a mechanism for reading `options` from a manifest file and initializes the Sandbox with such options.

# Motivation

Each field plugin usually has a sort of different options allowed, and
It's common, during development, to switch from one field plugin to another.

However, doing so will cause the Sandbox user to lose all the data/options he already defined and force him to initialize them again from scratch.

So, it would be nice to have a way of fetching this predefined data from a manifest file each time the user opens the Sandbox, giving them speed and consistency during their tests and development.

# Detailed design

## Declare a manifest file

Inside the root of each field plugin, a `field-plugin.config.json` file would be created with the following structure:

```
{
  "options": [
    {
        "key": "option1",
        "value": "value1"
    },
    {
        "key": "option2",
        "value": "value2"
    }
  ]
}
```

## Read the manifest file (CLI)

Each time a user runs `yarn dev` inside the plugin's root folder, our CLI will check if a `field-plugin.config.json` was provided and if so, it will read all options from it and, through our `printDev()` Vite plugin, provides a Sandbox URL with all options already included.

The URL with these options should be similiar with:

```
https://plugin-sandbox.storyblok.com/field-plugin?url=http://localhost:8080&options=[{%22key%22:%22option1%22,%22value%22:%22value1%22},{%22key%22:%22option2%22,%22value%22:%22value2%22}]
```

If the CLI doesn't find any manifest file, the process should continue as it's nowadays, creating the Sandbox URL thru `printDev()` Vite plugin, but with no options parameter added.

## Reading the Options from the URL (Sandbox)

When the Sandbox is loaded and it contains a query parameter named `options`, it'll parse this parameter and update the `section options` with them.

It also needs to trigger an event (`StateChangedMessage`) to notify the embedded plugin to consider these options in their `schema`.

After reading the options, the Sandbox container could remove it from the URL and keep only the mandatory parameters, such as the `URL`.

```
https://plugin-sandbox.storyblok.com/field-plugin?url=http://localhost:8080
```

# Drawbacks

- We need to make clear to the users about not sharing sensitive data inside this manifest file, since it could be shared with other or versioned.

# Alternatives

- An alternative would be creating presets inside the Plugin Editor module and loading these data from there.

# Adoption strategy

All the proposed approach would be something entirely new and transparent for all users.

It wouldn't raise any break changing and will affect all of Sandbox's user during development phase.

# Unresolved questions

- We may need to be specific to SERPs (`robot.txt` file) to not index the Sandbox
  if it contains queries strings. Something like:

```
User-agent: *
Disallow: /*?
```
