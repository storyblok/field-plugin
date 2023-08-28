- Start Date: 2023-08-28
- Target Major Version: 1.X
- Reference Issues:
- Implementation PR:

# Summary

Describes a mechanism for sharing all options defined for a plugin while using it through the Sandbox container.

# Motivation

Sometimes is nice and desirable to be able to share a plugin with some options already defined and in that way, let others check how the plugin behaves and also troubleshoot them.

So, have such a way, it would allow us to easily share our plugins with clients, support, and QA and give them a fast way to check them out.

# Detailed design

A button for generating the URL with options included should be created inside the Sandbox container.

This button, when clicked, should warn the user to be careful about sharing sensitive data, and after the user agrees to proceed with it, it should read all the defined options (in case it has any) and generate a shareable URL containing both the "url for the running plugin" as well as all the options.

Something like:

```
https://plugin-sandbox.storyblok.com/field-plugin?url=http://localhost:8080&options=[{%22key%22:%22option1%22,%22value%22:%22value1%22},{%22key%22:%22option2%22,%22value%22:%22value2%22}]
```

If no option is defined we can still share the "base sandbox url" (which includes the URL for the running plugin).

The result (generated URL) should be added directly into the user's clipboard.

# Drawbacks

- We need to make clear to the users about not sharing sensitive data.

# Alternatives

- All options could be synchronized with a backend and when shared, only a UUID be provided.

# Adoption strategy

All the proposed approach would be something entirely new and transparent for all users.

It wouldn't raise any break changes or negatively impact the users.

# Unresolved questions
