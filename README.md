# `@storyblok/field-plugin`

With the `@storyblok/field-plugin` library, you can build custom fields that will enhance the editing experience.

It's easy to get started! Simply
use [Storyblok's field plugin CLI](https://www.npmjs.com/package/@storyblok/field-plugin-cli) to bootstrap your project with your favorite frontend framework:

```shell
npx @storyblok/field-plugin-cli@beta
```

Storyblok provides the following starter projects:

- React
- Vue 3 (Composition API)
- Vue 2 (Options API)
- Vanilla JavaScript

[//]: # '- Solid'

## Integrating @storyblok/field-plugin

To integrate `@storyblok/field-plugin` into a frontend framework, bootstrap your application with the `--template js` flag.

```shell
npx @storyblok/field-plugin-cli@beta --template js
```

The entry point of the application is in `src/main.js`. Replace this code with the following:

```js
const rootElement = document.createElement('div')
rootElement.id = 'app'
document.body.appendChild(rootElement)
```

This adds a new node to the `body`. Mount your application to this node, and in the root component, run `createFieldPlugin()` as an effect. This will make your application start listening to events from Storyblok's Visual Editor.

Pass a callback function as an argument to `createFieldPlugin()`. This function will be called whenever the state of the
field plugin changes; such as when the user changes the value in the visual editor, opens the modal, selects an
asset, etc. This callback function receives a `FieldPluginResponse` object as argument (see the API reference below). Use this callback function to re-render your application.

`createFieldPlugin()` returns a cleanup function that removes all created side effects. Call this function when your
application unmounts.

Below are examples of how to integrate `@storyblok/field-plugin` with various JavaScript frontend frameworks, as well one example with _vanilla_ JavaScript.

### Vanilla JavaScript

If you choose to not use a frontend framework, an integration with `@storyblok/field-plugin` may look like

```js
import { createFieldPlugin } from '@storyblok/field-plugin'

// This button is the only element in this application
const buttonEl = document.createElement('button')
document.body.appendChild(buttonEl)

// Establish communication with the Visual Editor
createFieldPlugin((response) => {
  // Handle events from the Visual Editor by re-rendering the button element
  const { data, actions } = response
  buttonEl.textContent = `Increment: ${data.content ?? 0}`
  buttonEl.onclick = () => actions.setContent((data.content ?? 0) + 1)
})
```

### React

With React, create a hook:

```typescript
import { createFieldPlugin, FieldPluginResponse } from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

type UseFieldPlugin = () => FieldPluginResponse

export const useFieldPlugin: UseFieldPlugin = () => {
  const [state, setState] = useState<FieldPluginResponse>({ type: 'loading' })

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  return state
}
```

And render your component as such:

```tsx
export const App = () => {
  const { type, data, actions } = useFieldPlugin()

  if (type !== 'loaded') {
    return <></>
  }

  const handleClickIncrement = () =>
    actions.setContent(
      (typeof data.content === 'number' ? data.content : 0) + 1,
    )
  const label =
    typeof data.content === 'undefined'
      ? 'undefined'
      : JSON.stringify(data.content)

  return <button onClick={handleClickIncrement}>{label}</button>
}
```

[//]: # '### Vue 3'
[//]: #
[//]: # 'Coming soon...'
[//]: # 'With the composition api, create a hook:'
[//]: #
[//]: # '```markdown'
[//]: # 'TODO:'
[//]: # 'Something like'
[//]: # '1. create a reactive value'
[//]: # '2. call useFieldPlugin'
[//]: # "3. in useFieldPlugin's argument, update the state"
[//]: # '4. Note that we cannot send reactive objects via `Window.postMessage()`, so we have to proxy all calls to setContent in a function that wraps the value in `JSON.parse(JSON.stringify(value))`'
[//]: # '5. return the reactive value from the hook'
[//]: # '```'
[//]: #
[//]: # 'With the options api, create a mixin:'
[//]: #
[//]: # '```vue'
[//]: # 'TODO'
[//]: # '```'

## API Reference

`createFieldPlugin()` is a function that connects the field plugin to the Storyblok Visual Editor. It accepts a callback
function that is invoked with a `FieldPluginResponse` object whenever the state of the field plugin changes.

The function returns another function that can be used to clean up the event listeners that `createFieldPlugin()` added.

Parameters:

- `callback`: `(response: FieldPluginResponse) => void`: A callback function that is called whenever the state of the field plugin changes. The function is passed
  a `FieldPluginResponse` object as its only argument.

Return Value: `() => void`: A function that removes the event listeners added by `createFieldPlugin()`.

### FieldPluginResponse

`FieldPluginResponse` is an object that represents the current state of a field plugin.

Properties:

| Key       | Defined when `FieldPluginResponse.type` is | Description                                                                                                                                                                                                                  |
| --------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    |                                            | A string that indicates which overall state your field plugin is in. It can assume three values `loading`, `error`, and `loaded`.                                                                                            |
| `error`   | `"error"`                                  | If `FieldPluginResponse.type` is `error`, the `error` property will contain an `Error` object instance. Otherwise, it is `undefined`.                                                                                        |
| `data`    | `"loaded"`                                 | When `FieldPluginResponse.type` is `loaded`, this property will contain the state of the application that the Visual Editor has shared with the field plugin. Otherwise, it is `undefined`.                                  |
| `actions` | `"loaded"`                                 | When `FieldPluginResponse.type` is `loaded`, this property will contain an object whose properties are functions that enables the field plugin application to interact with the Visual Editor. Otherwise, it is `undefined`. |

#### FieldPluginResponse.type

`FieldPluginResponse.type` can assume three different values:

| Value       | Description                                                                                                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `"loading"` | When the state is initially loaded and has not yet establish communication with the Visual Editor.                                                                                  |
| `"error"`   | The plugin failed to load. This can happen, for example, if the field plugin URL is opened outside the Visual Editor. This is typically not a scenario that needs to be considered. |
| `"loaded"`  | The plugin successfully loaded and is ready-to-use.                                                                                                                                 |

#### FieldPluginResponse.data

`FieldPluginResponse.data` has the following properties:

| Key           | Description                                                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`     | The content of the field plugin that is part of the content.                                                                                             |
| `options`     | A dictionary/record of `string` key-value pairs, containing the options that were set up for this field plugin in the block schema.                      |
| `isModalOpen` | A boolean value that indicates whether the field plugin is embedded in a modal window.                                                                   |
| `language`    | The current language. Can be an empty string (`""`).                                                                                                     |
| `spaceId`     | The ID of the space.                                                                                                                                     |
| `story`       | The story how it was when the plugin was _initially_ loaded. To update this after the initial load, please refer to `response.actions.requestContext()`. |
| `storyId`     | The ID of the story.                                                                                                                                     |
| `blockUid`    | The UID of the block that the field plugin is part of.                                                                                                   |
| `token`       | A draft access token to the [Content Delivery API](https://www.storyblok.com/docs/api/content-delivery/v2#topics/authentication).                        |
| `uid`         | The UID of the field plugin.                                                                                                                             |

#### FieldPluginResponse.actions

`FieldPluginResponse.actions` has the following properties:

| Key                | Description                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setContent`       | Updates the content of the field plugin. For example, `setContent(3.14159)`                                                                                                                              |
| `setModalOpen`     | Opens/Closes the modal window. For example, `setModalOpen(true)`.                                                                                                                                        |
| `selectAsset`      | Opens the asset selector. Returns a promise that gets resolved when the user selects an asset. For example, `selectAsset().then((filename) => console.log(filename))`                                    |
| `requestContext()` | Updates the `request.data.story` property to the version of the story that is currently opened in the Visual Editor. That is, the unsaved version of the story that exists in the user's browser memory. |

## Caveats

Field plugins for Storyblok have some unique feature that one should be aware of. It can be tricky to set up a new project from scratch, and it is therefore recommended to bootstrap new projects with `npx @storyblok/field-plugin-cli@beta`.

### Single JavaScript Bundle

Field plugins must be bundled in a _single_ JavaScript file (`dist/index.js`), which is deployed to Storyblok. This means that all assets — including CSS files — must be either be encoded within this JavaScript file or served separately.

This has the following implications:

- CSS must be embedded within the JavaScript code. All starters uses Vite and [vite-plugin-css-injected-by-js](https://www.npmjs.com/package/vite-plugin-css-injected-by-js) to automatically bundle the CSS within; so you can keep using CSS, Sass, Css modules, etc. as you normally would. Another option is to use a css-in-js solution, such as [Emotion](https://emotion.sh/docs/introduction) or [JSS](https://cssinjs.org/).
- Image assets must be served externally (or Base64-encoded in the source code), as they cannot be uploaded to Storyblok via the field plugin editor.
- The `index.html` file is only used in local development to simulate the production environment. Any changes to `index.html` will _not_ be reflected in the production environment.
- Code splitting is not available, as all code must be loaded from the same endpoint.
