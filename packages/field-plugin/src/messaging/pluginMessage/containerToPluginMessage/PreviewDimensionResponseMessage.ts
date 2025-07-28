import { isMessageToPlugin, type MessageToPlugin } from './MessageToPlugin'

export type PreviewDimensionResponseMessage =
  MessageToPlugin<'preview-dimension'>

export const isPreviewDimensionResponse = (
  data: unknown,
): data is PreviewDimensionResponseMessage =>
  isMessageToPlugin(data) && data.action === 'preview-dimension'
