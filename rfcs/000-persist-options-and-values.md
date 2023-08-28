- Start Date: 2023-08-07
- Target Major Version: 1.X
- Reference Issues:
- Implementation PR:

# Summary

Describes a mechanism for persisting plugins' options and their corresponding values while using the Plugin Sandbox.

# Motivation

Each field plugin usually has a sort of different options defined, and
it's common either to refresh the Field Plugin Sandbox page during
development/test or to switch from one field plugin to another.

In doing so, it would be nice to, somehow, persist both options and their
corresponding values. This way the user would not need to recreate all
of them while refreshing the Sandbox page or switching between field plugins.

# Detailed design

## Reflect Sandbox options changes in the LocalStorage

For every change in our `options` list, such as adding/removing items as well as
changes to option names or values, should update the [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) with the respective updated values.

Example:

```
const { options, storage } = sandbox.getInstance(...)

watch(options, (newValue) => {
  storage.sync(options)
})
```

# Drawbacks

- Changing browsers would require it to be recreated from scratch;
- We would need to have a `key` for persisting it properly and avoid mixing data between different
  field-plugins.

# Alternatives

- All options could be synchronized with a backend and when shared, only a UUID be provided (for fetching the options). It'd allow changing browsers but also it would add complexity to the solution.

# Adoption strategy

All the proposed approach would be something entirely new and transparent for all users.
It wouldn't raise any break change or impact negatively the users.

# Unresolved questions

- Which key are we going to use for storing those data?
- Should we provide a "reset" button for clearing all the local storage?
