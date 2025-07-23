import { is, object, string, literal, optional, number, variant } from 'valibot'
import { MessageToContainer } from './MessageToContainer'

export type Dimension =
  | {
      tag: 'desktop'
    }
  | {
      tag: 'tablet'
    }
  | {
      tag: 'mobile'
    }
  | {
      tag: 'custom'
      width: number
    }

export type PreviewDimensionChangeMessage =
  MessageToContainer<'previewDimension'> & {
    data: Dimension
  }

export const isPreviewDimensionChangeMessage = (
  data: unknown,
): data is PreviewDimensionChangeMessage =>
  is(
    object({
      action: literal('plugin-changed'),
      uid: string(),
      callbackId: optional(string()),
      event: literal('previewDimension'),
      data: variant('tag', [
        object({
          tag: literal('desktop'),
        }),
        object({
          tag: literal('tablet'),
        }),
        object({
          tag: literal('mobile'),
        }),
        object({
          tag: literal('custom'),
          width: number(),
        }),
      ]),
    }),
    data,
  )

export const previewDimensionsChangeMessage = (
  options: Pick<PreviewDimensionChangeMessage, 'uid' | 'callbackId' | 'data'>,
): PreviewDimensionChangeMessage => ({
  action: 'plugin-changed',
  event: 'previewDimension',
  ...options,
})
