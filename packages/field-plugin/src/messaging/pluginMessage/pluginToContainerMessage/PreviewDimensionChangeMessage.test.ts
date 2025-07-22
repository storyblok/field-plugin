import {
  isPreviewDimensionChangeMessage,
  previewDimensionsChangeMessage,
  PreviewDimensionChangeMessage,
} from './PreviewDimensionChangeMessage'
import { isMessageToContainer } from './MessageToContainer'
import { expect } from 'vitest'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: PreviewDimensionChangeMessage = {
  action: 'plugin-changed',
  event: 'previewDimension',
  uid,
  data: {
    tag: 'desktop',
  },
}

describe('PreviewDimensionsChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "previewDimension"', () => {
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          event: 'previewDimension',
        }),
      ).toEqual(true)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
    test('that the data property is present', () => {
      const { data: _data, ...withoutModel } = stub
      expect(isPreviewDimensionChangeMessage(withoutModel)).toEqual(false)
    })
    test('that the data property can be one of the tagged objects', () => {
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: {
            tag: 'desktop',
          },
        }),
      ).toEqual(true)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: {
            tag: 'tablet',
          },
        }),
      ).toEqual(true)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: {
            tag: 'mobile',
          },
        }),
      ).toEqual(true)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: {
            tag: 'custom',
            width: 1234,
          },
        }),
      ).toEqual(true)
    })
    test('that the data property cannot be any value', () => {
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: undefined,
        }),
      ).toEqual(false)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: null,
        }),
      ).toEqual(false)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: {},
        }),
      ).toEqual(false)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: 'a string',
        }),
      ).toEqual(false)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: true,
        }),
      ).toEqual(false)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: 123.123,
        }),
      ).toEqual(false)
      expect(
        isPreviewDimensionChangeMessage({
          ...stub,
          data: [],
        }),
      ).toEqual(false)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(
        previewDimensionsChangeMessage({
          uid,
          callbackId,
          data: {
            tag: 'desktop',
          },
        }),
      ).toHaveProperty('uid', uid)
    })
    it('includes the data', () => {
      expect(
        previewDimensionsChangeMessage({
          uid,
          callbackId,
          data: {
            tag: 'desktop',
          },
        }),
      ).toHaveProperty('data', {
        tag: 'desktop',
      })
      expect(
        previewDimensionsChangeMessage({
          uid,
          callbackId,
          data: {
            tag: 'tablet',
          },
        }),
      ).toHaveProperty('data', {
        tag: 'tablet',
      })
      expect(
        previewDimensionsChangeMessage({
          uid,
          callbackId,
          data: {
            tag: 'mobile',
          },
        }),
      ).toHaveProperty('data', {
        tag: 'mobile',
      })
      expect(
        previewDimensionsChangeMessage({
          uid,
          callbackId,
          data: {
            tag: 'custom',
            width: 1234,
          },
        }),
      ).toHaveProperty('data', {
        tag: 'custom',
        width: 1234,
      })
    })
  })
})
