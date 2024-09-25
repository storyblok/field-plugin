import { isMessageToContainer } from './MessageToContainer'
import {
  isValueChangeMessage,
  ValueChangeMessage,
  valueChangeMessage,
} from './ValueChangeMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: ValueChangeMessage = {
  action: 'plugin-changed',
  event: 'update',
  uid,
  model: undefined,
}

describe('ValueChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "update"', () => {
      expect(
        isValueChangeMessage({
          ...stub,
          event: 'update',
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
    test('that the model property is present', () => {
      const { model: _model, ...withoutModel } = stub
      expect(isValueChangeMessage(withoutModel)).toEqual(false)
    })
    test('that the model property can be any value', () => {
      expect(
        isValueChangeMessage({
          ...stub,
          model: undefined,
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          model: null,
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          model: {},
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          model: 'a string',
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          model: true,
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          model: 123.123,
        }),
      ).toEqual(true)
      expect(
        isValueChangeMessage({
          ...stub,
          model: [],
        }),
      ).toEqual(true)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(
        valueChangeMessage({ uid, callbackId, model: undefined }),
      ).toHaveProperty('uid', uid)
    })
    it('includes the model', () => {
      expect(
        valueChangeMessage({ uid, callbackId, model: true }),
      ).toHaveProperty('model', true)
      expect(
        valueChangeMessage({ uid, callbackId, model: 'a string' }),
      ).toHaveProperty('model', 'a string')
      expect(
        valueChangeMessage({ uid, callbackId, model: 123 }),
      ).toHaveProperty('model', 123)
      expect(
        valueChangeMessage({ uid, callbackId, model: { a: 1 } }),
      ).toHaveProperty('model', {
        a: 1,
      })
      expect(
        valueChangeMessage({ uid, callbackId, model: [1, 2, 3] }),
      ).toHaveProperty('model', [1, 2, 3])
      expect(
        valueChangeMessage({ uid, callbackId, model: undefined }),
      ).toHaveProperty('model', undefined)
      expect(
        valueChangeMessage({ uid, callbackId, model: null }),
      ).toHaveProperty('model', null)
    })
  })
})
