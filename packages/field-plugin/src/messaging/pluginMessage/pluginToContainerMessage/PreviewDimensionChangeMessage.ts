import { MessageToContainer } from './MessageToContainer'
import {
  equalsGuard,
  isNumber,
  isString,
  objectGuard,
  oneOfGuard,
  optionalGuard,
} from 'pure-parse'

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
export const isPreviewDimensionChangeMessage =
  objectGuard<PreviewDimensionChangeMessage>({
    action: equalsGuard('plugin-changed'),
    uid: isString,
    callbackId: optionalGuard(isString),
    event: equalsGuard('previewDimension'),
    data: oneOfGuard(
      objectGuard({
        tag: equalsGuard('desktop'),
      }),
      objectGuard({
        tag: equalsGuard('tablet'),
      }),
      objectGuard({
        tag: equalsGuard('mobile'),
      }),
      objectGuard({
        tag: equalsGuard('custom'),
        width: isNumber,
      }),
    ),
  })

export const previewDimensionsChangeMessage = (
  options: Pick<PreviewDimensionChangeMessage, 'uid' | 'callbackId' | 'data'>,
): PreviewDimensionChangeMessage => ({
  action: 'plugin-changed',
  event: 'previewDimension',
  ...options,
})
