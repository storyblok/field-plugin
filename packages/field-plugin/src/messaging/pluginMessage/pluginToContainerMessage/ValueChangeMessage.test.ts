import { isMessageToContainer } from './MessageToContainer'
import {
  isValueChangeMessage,
  valueChangeMessage,
  ValueChangeMessage,
} from './ValueChangeMessage'

const uid = '-preview-abc-123'
const stub: ValueChangeMessage = {
  action: 'plugin-changed',
  event: 'update',
  uid,
  model: undefined,
}

describe('ValueChangeMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toBeTruthy()
    })
    it('requires event to be "update"', () => {
      expect(
        isValueChangeMessage({
          ...stub,
          event: 'update',
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toBeFalsy()
    })
    test('that the model property is present', () => {
      const { model: _, ...withoutModel } = stub
      expect(isValueChangeMessage(withoutModel)).toBeFalsy()
    })
    test('that the model property can be any value', () => {
      expect(
        isValueChangeMessage({
          ...stub,
          model: undefined,
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          model: null,
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          model: {},
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          model: 'a string',
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          model: true,
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          model: 123.123,
        }),
      ).toBeTruthy()
      expect(
        isValueChangeMessage({
          ...stub,
          model: [],
        }),
      ).toBeTruthy()
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(valueChangeMessage(uid, undefined)).toHaveProperty('uid', uid)
    })
    it('includes the model', () => {
      expect(valueChangeMessage(uid, true)).toHaveProperty('model', true)
      expect(valueChangeMessage(uid, 'a string')).toHaveProperty(
        'model',
        'a string',
      )
      expect(valueChangeMessage(uid, 123)).toHaveProperty('model', 123)
      expect(valueChangeMessage(uid, { a: 1 })).toHaveProperty('model', {
        a: 1,
      })
      expect(valueChangeMessage(uid, [1, 2, 3])).toHaveProperty(
        'model',
        [1, 2, 3],
      )
      expect(valueChangeMessage(uid, undefined)).toHaveProperty(
        'model',
        undefined,
      )
      expect(valueChangeMessage(uid, null)).toHaveProperty('model', null)
    })
  })
})
