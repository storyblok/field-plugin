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

## Reflect Sandbox options changes in the URL

For every change in our `options` list, such as adding/removing items as well as
changes to option names or values should trigger a url update call.

This behavior can be implemented through the use of [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) 
as the example below:

```
const { options } = sandbox.getInstance(...)

watch(options, (newValue) => {

    const url = '/?' + new URLSearchParams(newValue).toString();

    history.replaceState(null, '', url);
})
```

Here would be nice to may use `history.replaceState()` rather than
`history.pushState()` once it wouldn't do a full page reload and also
not change the history stack.

# Drawbacks

- Sensitive data could be easily exposed once the URL can be shared.
  One option here would be to warn the user inside the Field Plugin Sandbox page.
- Each browser has its size limit.

# Alternatives

Another approach would be persisting options and values using the localStorage API.
It would allow a larger storage size than using [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
and avoid sharing sensitive data.

However, here we also would have some drawbacks:

- Not shareable (sharing could be useful for debugging or troubleshooting);
- Changing browsers would require recreation;
- We would need to have a `key` for persisting it properly and avoid mixing data between different
  field-plugins.

# Adoption strategy

All the proposed approach would be something entirely new and transparent for all users.
It wouldn't raise any break changing and will affect all of Sandbox's user.

# Unresolved questions

- What would be the behavior when the users navigate using the back and forward button?
  We may use `replaceState()` in place of `pushState()` since it would not reload the page or change the
  history stack.
- If the user adds/removes options directly in the URL as well as its values, we would
  also need to reflect everything with both the "options section" and also the field plugin itself.
- Should we provide a "reset" option for clearing all the options in both URL and "options section"?
- Using this approach might users have a poor experience with this approach?
- We may need to be specific to SERPs (`robot.txt` file) to not index the Sandbox
  if it contains queries strings. Something like:

```
User-agent: *
Disallow: /*?
```

If we use `history.replaceState()` it may not be required.
