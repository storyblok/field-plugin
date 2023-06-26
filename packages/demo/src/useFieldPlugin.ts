import {
  createFieldPlugin,
  FieldPluginData,
  FieldPluginResponse,
  pluginLoadedMessage,
  pluginUrlParamsFromUrl,
  FieldPluginActions,
  valueChangeMessage,
  createPluginDataListener,
  modalChangeMessage,
  assetModalChangeMessage,
} from '@storyblok/field-plugin'
import { useEffect, useMemo, useState } from 'react'

type UseFieldPlugin = () => FieldPluginResponse

export const useFieldPlugin_old: UseFieldPlugin = () => {
  const [state, setState] = useState<FieldPluginResponse>(() => ({
    type: 'loading',
  }))

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  return state
}

const postToContainer = (message: unknown) => {
  // TODO specify https://app.storyblok.com/ in production mode, * in dev mode
  const origin = '*'
  window.parent.postMessage(message, origin)
}

const initialState: FieldPluginData = {
  isModalOpen: false,
  content: undefined,
  options: {},
  story: { content: {} },
  blockUid: undefined,
  storyId: undefined,
  token: undefined,
  uid: '-preview',
  spaceId: undefined,
}

const createPluginActions = () => {
  const params = pluginUrlParamsFromUrl(window.location.search)

  const uid = params?.uid ?? ''

  return {
    setContent: (content: unknown) =>
      postToContainer(valueChangeMessage(uid, content)),
    setModalOpen: (isOpen: boolean) =>
      postToContainer(modalChangeMessage(uid, isOpen)),
    openAssetSelector: () => postToContainer(assetModalChangeMessage(uid)),
    initialize: () => postToContainer(pluginLoadedMessage(uid)),
  }
}

export const useFieldPlugin: UseFieldPlugin = () => {
  const [initialized, setInitialized] = useState(false)
  const [data, setData] = useState<FieldPluginData>(initialState)
  const pluginActions = useMemo(() => createPluginActions(), [])
  const actions: FieldPluginActions = {
    setContent: (action) => {
      setData((data) => {
        const content: unknown =
          // This is not safe: if the user pass a function to setContent(),
          //  this code assumes that it is an updater function
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          typeof action === 'function' ? action(data.content) : action

        pluginActions.setContent(content)
        return {
          ...data,
          content,
        }
      })
    },
    selectAsset: () => {
      pluginActions.openAssetSelector()
      return Promise.resolve({ filename: '' })
    },
    requestContext: () => {},
    setModalOpen: (action) => {
      const isModalOpen: boolean =
        // This is not safe: if the user pass a function to setContent(),
        //  this code assumes that it is an updater function
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        typeof action === 'function' ? action(data.content) : action

      pluginActions.setModalOpen(isModalOpen)
      return {
        ...data,
        isModalOpen,
      }
    },
  }

  // Sync external changes
  useEffect(() => {
    pluginActions.initialize()
    const cleanup = createPluginDataListener((newData) =>
      setData((oldData) => ({
        ...oldData,
        ...newData,
      })),
    )
    setInitialized(true)
    return cleanup
  }, [pluginActions])

  return initialized
    ? { type: 'loaded', data, actions }
    : {
        type: 'loading',
      }
}
