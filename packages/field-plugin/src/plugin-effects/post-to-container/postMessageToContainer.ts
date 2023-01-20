import { originFromPluginParams } from '../../plugin-api/pluginUrlParams/originFromPluginParams/originFromPluginParams'
import { MessageToContainer } from './MessageToContainer'
import { pluginUrlParamsFromUrl } from '../../plugin-api/pluginUrlParams/pluginUrlParamsFromUrl'

export type MessageToWrapper = {
  event: string
} & Record<string, unknown>

export type PostMessageToContainer = (message: MessageToWrapper) => void

// TODO include information about the result in the return signature, like an error
export const postMessageToContainer: PostMessageToContainer = (message) => {
  const fieldTypeParams = pluginUrlParamsFromUrl(window.location.search)
  if (!fieldTypeParams) {
    // The custom field's containing iframe does not have all required search params
    console.warn(
      `Could not postMessage to parent application because the URL search query does not contain sufficient information about the parent's URL.`,
    )
    return
  }
  postMessageToParent(
    {
      action: 'plugin-changed',
      uid: fieldTypeParams.uid,
      ...message,
    },
    originFromPluginParams(fieldTypeParams),
  )
}

type PostMessageToOrigin = (
  message: MessageToContainer<string>,
  origin: string,
) => void

const postMessageToParent: PostMessageToOrigin = (message, origin) => {
  parent.postMessage(cloneableObject(message), origin)
}

/**
 * Returns a new object without function properties. This will be a problem in reactive libraries such as Vue, where
 * reactive data structures have function properties that makes them unserializable.
 */
const cloneableObject = (v: unknown): unknown => JSON.parse(JSON.stringify(v))
