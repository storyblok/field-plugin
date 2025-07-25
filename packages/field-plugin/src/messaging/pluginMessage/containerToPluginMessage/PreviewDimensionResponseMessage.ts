import { isMessageToPlugin, type MessageToPlugin } from './MessageToPlugin'

export type PreviewDimensionResponse = MessageToPlugin<'preview-dimension'>

export const isPreviewDimensionResponse = (
  data: unknown,
): data is PreviewDimensionResponse =>
  isMessageToPlugin(data) && data.action === 'preview-dimension'
