# `@storyblok/field-plugin`

Create your own field plugins for storyblok with the `@storyblok/field-plugin` library.

To bootstrap a field plugin project, please refer
to  [@storyblok/field-plugin-cli](https://www.npmjs.com/package/@storyblok/field-plugin-cli).

```shell
npx @storyblok/field-plugin-cli create
```

## How to Integrate with your application.

By invoking `createFieldPlugin()` as an effect, your application will start listening to events from Storyblok's visual
editor (or the field plugin editor). The return value is a function that cleans up all created side effects.

As an argument to `createFieldPlugin()`, pass a callback function. This function will be invoked whenever the state of
the field plugin changes, for example

- when the user change the value in the Visual Editor.
- when the user opens the modal
- when the user selects an asset

Use the callback function to update the state of your application via your JavaScript frontend framework of choice.

In the following subsections, you will find examples for how to integrate `@storyblok/field-plugin` with various popular
JavaScript frontend frameworks.

### React

Create a React hook:

```typescript
import {createFieldPlugin, FieldPluginResponse} from '@storyblok/field-plugin'
import {useEffect, useState} from 'react'

type UseFieldPlugin = () => FieldPluginResponse

export const useFieldPlugin: UseFieldPlugin = () => {
  const [state, setState] = useState<FieldPluginResponse>(() => ({
    type: 'loading',
  }))

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  return state
}
```

And render your component:

```tsx
export const App = () => {
  const {isLoading, error, data, actions} = useFieldPlugin()

  if (type !== 'loaded') {
    return <></>
  }

  const handleClickIncrement = () =>
          actions?.setValue((typeof data.value === 'number' ? data.value : 0) + 1)
  const label =
          typeof data.value === 'undefined' ? 'undefined' : JSON.stringify(data.value)
  
  return (
    <button
      onClick={handleClickIncrement}
    >
      {label}
    </button>
  )
}
```

### Vue 3

With the composition api, create a hook:

```markdown
TODO:
Something like
1. create a reactive value
2. call useFieldPlugin
3. in useFieldPlugin's argument, update the state
4. Note that we cannot send reactive objects via `Window.postMessage()`, so we have to proxy all calls to setValue in a function that wraps the value in `JSON.parse(JSON.stringify(value))`
5. return the reactive value from the hook
```

With the options api, create a mixin:

```vue
TODO
```

## API Reference

`createFieldPlugin()` accepts a callback function as an argument. When the state of the plugin chages, this callback function is invoked with a `FieldPluginResponse` object as argument. This object has the following properties:

- `isLoaded`: a boolean value that indicates whether your application has received data from Storyblok's Visual
  Editor.
- `isLoading`: a boolean value that indicates whether your application has received data from Storyblok's Visual
  Editor.
- `error`: If `createFieldPlugin()` failed to connect to the Visual Editor, this propery will contain an `Error`,
  otherwise `undefined`.
- `data`: If `createFieldPlugin()` successfully connected to the Visual Editor, this property will contain the state
  of the application that the Visual Editor has shared with the field plugin. It has the following properties:
    - `value`:
    - `options`:
    - `isModalOpen`:
    - `language`:
    - `spaceId`:
    - `story`:
    - `storyId`:
    - `blockUid`:
    - `token`:
    - `uid`:
    - `story`: Note: does not update when the story changes. If you need to refresh the story after the field plugin
      was initially set up, call `actions.getContext()`.
    - `height`
- `actions`: If `createFieldPlugin()` successfully connected to the Visual Editor, this property will contain an
  object whose properties are functions that enables the field plugin application to interact with the Visual Editor.
    - `setValue`
    - `setModalOpen`
    - `selectAsset`
    - `setPluginReady`
    - `setHeight`
    - `requestContext()`
