- Start Date: 2023-08-07
- Target Major Version: 1.X
- Reference Issues:
- Implementation PR:

# Summary

Describes a mechanism for persisting plugins' options and their corresponding values while using the Plugin Sandbox.

# Motivation

Each field plugin usually has a sort of different options defined, and
It's common either to refresh the Field Plugin Sandbox page during
development/test or to switch from one field plugin to another.

In doing so, it would be nice to, somehow, persist both options and their
corresponding values. This way the user would not need to recreate all
of them while refreshing the Sandbox page or switching between field plugins.

As many approaches were raised, we decided to classify them, and then, have a better understanding
in what characteristics should we focus right now, in the first moment.

## The suggested approaches were the following:

1. Synchronizing the options in the URL in real-time (original RFC)
2. Manifest file + Click to copy URL with options included
3. LocalStorage + Click to copy URL with options included
4. Manifest file as initial value + LocalStorage to store any changes on top of it + Click to copy URL with options included

## After analyzing them, we were able to classify them based on the following traits:

A. Bootstrapping the plugin options from the URL
B. Bootstrapping from preset
C. Synchronizing the data locally in real-time
D. Sharing our options through url query-strings

## With this traits, we categorized each of them as following:

1. Synchronizing the options in the URL in real-time (original RFC): **A, C, D**
2. Manifest file + Click to copy URL with options included: **A, B, D**
3. LocalStorage + Click to copy URL with options included: **A, C, D**
4. Manifest file as initial value + LocalStorage to store any changes on top of it + Click to copy URL with options included: **A, B, C, D**

## Conclusion

- We decided the first option should be avoided since the user could easily exposes some confidential data without even realize the risks.
- We decided the third and fourth options would be laied of to a future improvement, since real-time persistence should no be handled in this first step.

These exclusions let us with just the second option "Manifest file + Click to copy URL with options included" in which we're going to cover better in the `Detailed design` setion.

# Detailed design

## Declaring a manifest file

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

## Reading the manifest file (CLI)

Each time a user runs `yarn dev` inside the plugin's root folder, our CLI would check if a `field-plugin.config.json` was provided and if so, it will read all options from it and, through our `printDev()` Vite plugin, provides a Sandbox URL with all options already included.

The URL with these options should be similiar with:

```
https://plugin-sandbox.storyblok.com/field-plugin?url=http://localhost:8080&manifest={"options":[{"key":"option1","value":"value1"},{"key":"option2","value":"value2"}]}
```

If the CLI doesn't find any manifest file, the process should continue as it's nowadays, creating the Sandbox URL thru `printDev()` Vite plugin, but with no options parameter added.

## Reading the options from the URL parameters (Sandbox)

When the Sandbox is loaded and it contains a query parameter named `manifest`, it'll parse this parameter and update the `section options` based on the `options` (from the manifest object) property.

It also needs to trigger an event (`StateChangedMessage`) to notify the embedded plugin to consider these options in their `schema`.

## Share button

A button for generating the URL with options included should be created inside the Sandbox container.

This button, when clicked, should warn the user to be careful about sharing sensitive data, and after the user agrees to proceed with it, it should read all the defined options (in case it has any) and generate a shareable URL containing both the "url for the running plugin" as well as all the options.

If no option is defined we can still share the "base sandbox url" (which includes the URL for the running plugin).

The result (generated URL) should be added directly into the user's clipboard and no changing in the URL should happens.

# Drawbacks

- Should be clear to the users about not sharing sensitive data in both manifest file as well when sharing the generated url.

# Alternatives

- All options could be synchronized in real-time using the HistoryAPI.
- All options could be synchronized in real-time localStorage API.
- All options could be synchronized with a backend and when shared, only a UUID be provided (for fetching the options).

# Adoption strategy

All the proposed approach would be something entirely new and transparent for all users.
It wouldn't raise any break change or impact negatively the users.

# Unresolved questions
