import { hasKey } from '../../utils'

export type MessageToContainer<Event extends string> = {
  action: 'plugin-changed'
  uid: string
  event: Event
}

export const isPluginToWrapperMessage = (
  obj: unknown,
): obj is MessageToContainer<string> =>
  hasKey(obj, 'action') &&
  obj.action === 'plugin-changed' &&
  hasKey(obj, 'uid') &&
  typeof obj.uid === 'string' &&
  hasKey(obj, 'event') &&
  typeof obj.event === 'string'

export type ValueChangeMessage = MessageToContainer<'update'> & {
  model: unknown
}

export const isValueChangeMessage = (obj: unknown): obj is ValueChangeMessage =>
  isPluginToWrapperMessage(obj) &&
  obj.event === 'update' &&
  hasKey(obj, 'model')

export type ModalChangeMessage = MessageToContainer<'toggleModal'> & {
  status: boolean
}

export const isModalChangeMessage = (obj: unknown): obj is ModalChangeMessage =>
  isPluginToWrapperMessage(obj) &&
  obj.event === 'toggleModal' &&
  hasKey(obj, 'status') &&
  typeof obj.status === 'boolean'

export type PluginLoadedMessage = MessageToContainer<'loaded'>

export const isPluginLoadedMessage = (
  obj: unknown,
): obj is PluginLoadedMessage =>
  isPluginToWrapperMessage(obj) && obj.event === 'loaded'

export type HeightChangeMessage = MessageToContainer<'heightChange'> & {
  height: number
}

export const isHeightChangeMessage = (
  obj: unknown,
): obj is HeightChangeMessage =>
  isPluginToWrapperMessage(obj) &&
  obj.event === 'heightChange' &&
  hasKey(obj, 'height') &&
  typeof obj.height === 'number'

export type GetContextMessage = MessageToContainer<'getContext'>

export const isGetContextMessage = (obj: unknown): obj is GetContextMessage =>
  isPluginToWrapperMessage(obj) && obj.event === 'getContext'
