# `@storyblok/field-plugin`

With the `@storyblok/field-plugin` library, you can build custom fields that will enhance your editing experience.

It's easy to get started! Simply use [Storyblok's field plugin CLI](https://www.npmjs.com/package/@storyblok/field-plugin-cli) to bootstrap your project:

```shell
npx @storyblok/field-plugin-cli@alpha
```

The guide provides examples for integrating with various popular JavaScript frontend frameworks, including React and Vue

## Integrating with any framework

To integrate with your application, invoke `createFieldPlugin()` as an effect. This will allow your application to start listening to events from Storyblok's visual editor or field plugin editor. 

`createFieldPlugin()` returns a cleanup function that removes all created side effects. Call this function when your component unmounts.

Pass a callback function as an argument to `createFieldPlugin()`. This function will be called whenever the state of the field plugin changes, such as when the user changes the value in the visual editor, opens the modal, or selects an asset. Use this callback function to update the state of your application using your preferred JavaScript frontend framework.

Below are examples of how to integrate `@storyblok/field-plugin` with popular JavaScript frontend frameworks.

### React

Create a React hook:

```typescript
import {createFieldPlugin, FieldPluginResponse} from '@storyblok/field-plugin'
import {useEffect, useState} from 'react'

type UseFieldPlugin = () => FieldPluginResponse

export const useFieldPlugin: UseFieldPlugin = () => {
  const [state, setState] = useState<FieldPluginResponse>({ type: 'loading' })

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  return state
}
```

And render your component:

```tsx
export const App = () => {
  const {type, data, actions} = useFieldPlugin()

  if (type !== 'loaded') {
    return <></>
  }

  const handleClickIncrement = () =>
          actions?.setValue((typeof data.value === 'number' ? data.value : 0) + 1)
  const label =
          typeof data.value === 'undefined' ? 'undefined' : JSON.stringify(data.value)
  
  return (
    <button onClick={handleClickIncrement}>
      {label}
    </button>
  )
}
```

### Vue 3

Coming soon...

[//]: # (With the composition api, create a hook:)

[//]: # ()
[//]: # (```markdown)

[//]: # (TODO:)

[//]: # (Something like)

[//]: # (1. create a reactive value)

[//]: # (2. call useFieldPlugin)

[//]: # (3. in useFieldPlugin's argument, update the state)

[//]: # (4. Note that we cannot send reactive objects via `Window.postMessage&#40;&#41;`, so we have to proxy all calls to setValue in a function that wraps the value in `JSON.parse&#40;JSON.stringify&#40;value&#41;&#41;`)

[//]: # (5. return the reactive value from the hook)

[//]: # (```)

[//]: # ()
[//]: # (With the options api, create a mixin:)

[//]: # ()
[//]: # (```vue)

[//]: # (TODO)

[//]: # (```)

## API Reference

`createFieldPlugin()` is a function that connects the field plugin to the Storyblok Visual Editor. It accepts a callback function that is invoked with a `FieldPluginResponse` object whenever the state of the field plugin changes.

The function returns another function that can be used to clean up the event listeners that `createFieldPlugin()` added.

Parameters:

- `callback`: A function that is called whenever the state of the field plugin changes. The function is passed a `FieldPluginResponse` object as its only argument. 

Return Value:

- `() => void`: A function that removes the event listeners added by `createFieldPlugin()`.

### `FieldPluginResponse`

`FieldPluginResponse` is an object that represents the current state of a field plugin.

Properties:

- `type`: A string that indicates which overall state your field plugin is in. It can assume three values:
  - `loading`: When the state is initially loaded and has not yet establish communication with the Visual Editor.
  - `error`: The plugin failed to load. This can happen, for example, if the field plugin URL is opened outside the Visual Editor. This is typically nothing to worry about.
  - `loaded`: The plugin successfully loaded and is ready-to-use.
- `error`: If `request.type` is `error`, the `error` property will contain an `Error` object instance.
  Otherwise, it is `undefined`.
- `data`: If `request.type` is `loaded`, this property will contain the state
  of the application that the Visual Editor has shared with the field plugin. It has the following properties:
    - `value`: The value of the field plugin that is part of the content.
    - `options`: A dictionary/record of `string` key-value pairs, containing the options that were set up for this field plugin in the block schema.
    - `isModalOpen`: A boolean value that indicates whether the field plugin is embedded in a modal window.
    - `language`: The current language. Can be an empty string (`""`). 
    - `spaceId`: The ID of the space.
    - `story`: The story how it was when the plugin was _initially_ loaded. To update this after the initial load, please refer to `response.actions.requestContext()`.
    - `storyId`: The ID of the story.
    - `blockUid`: The UID of the block that the field plugin is part of.
    - `token`: A draft access token to the [Content Delivery API](https://www.storyblok.com/docs/api/content-delivery/v2#topics/authentication).
    - `uid`:  The UID of the field plugin.
    - `height`: the height of the window.
- `actions`: When `createFieldPlugin()` has connected to the Visual Editor, this property will contain an
  object whose properties are functions that enables the field plugin application to interact with the Visual Editor.
    - `setValue`: Updates the value of the field plugin. For example, `setValue(3.14159)`
    - `setModalOpen`: Opens/Closes the modal window. For example, `setModalOpen(true)`.
    - `selectAsset`: Opens the asset selector. Accepts a callback function as argument which will be called when the user has selected an asset. For example, `selectAsset((fileName) => setValue(filename))`
    - `requestContext()`: Updates the `request.data.story` property to the version of the story that is currently opened in the Visual Editor. That is, the unsaved version of the story that exists in the user's browser memory.

