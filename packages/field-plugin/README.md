# `@storyblok/field-plugin`

Create your own field plugins for storyblok with the `@storyblok/field-plugin` library.

## How to Integrate with your application.

By invoking `createFieldPlugin()`, your application will start listening to events from Storyblok's visual editor (or the field plugin editor).

As an argument, pass a callback function. This function will be invoked whenever the state of the field plugin changes, for example when the Storyblok end-user changes the value.

In the following subsections, you will find examples of how to integrate this library with your JavaScript framework of choice.

For a seamless developer experience, bootstrap your project with `@storyblok/field-plugin-cli`:

```shell
npx @storyblok/field-plugin-cli create
```

### React

TODO

### Vue 3

With the composition api, create a hook:

```vue

```

With the options api...

```vue
```

## API Reference

The callback function in `createFieldPlugin()`'s argument is invoked with one argument of the type `FieldPluginResponse`. This object has the following properties:

- `isLoaded` -- a boolean value that indicates whether your application has received data from Storyblok's Visual Editor.
- `error` -- If `createFieldPlugin()` failed to connect to the Visual Editor, this propery will contain an `Error`, otherwise `undefined`.
- `data` -- If `createFieldPlugin()` successfully connected to the Visual Editor, this property will contain the state of the application that the Visual Editor has shared with the field plugin. It has the following properties:
  - `value` -- 
  - `options` -- 
  - `isModalOpen` -- 
  - `language` -- 
  - `spaceId` -- 
  - `story` -- 
  - `storyId` -- 
  - `blockUid` -- 
  - `token` -- 
  - `uid` -- 
  - `story` -- Note: does not update when the story changes. If you need to refresh the story after the field plugin was initially set up, call `actions.getContext()`.
  - `height`
- `actions` -- If `createFieldPlugin()` successfully connected to the Visual Editor, this property will contain an object whose properties are functions that enables the field plugin application to interact with the Visual Editor.
  - `setValue`
  - `setModalOpen`
  - `selectAsset`
  - `setPluginReady`
  - `setHeight`
  - `requestContext()`
