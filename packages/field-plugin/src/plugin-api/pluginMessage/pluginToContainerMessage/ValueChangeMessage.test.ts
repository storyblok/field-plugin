import { isMessageToContainer } from './MessageToContainer'
import { isValueChangeMessage, ValueChangeMessage } from './ValueChangeMessage'

const stub: ValueChangeMessage = {
  action: 'plugin-changed',
  event: 'update',
  uid: '-prevew',
  model: undefined,
}

describe('ValueChangeMessage', () => {
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
