import {
  HeightChangeMessage,
  isHeightChangeMessage,
} from './HeightChangeMessage'
import { isMessageToContainer } from './MessageToContainer'

const stub: HeightChangeMessage = {
  action: 'plugin-changed',
  event: 'heightChange',
  uid: '-prevew',
  height: 100,
}

describe('isHeightChangeMessage', () => {
  it('is a MessageToContainer', () => {
    expect(isMessageToContainer(stub)).toBeTruthy()
  })
  test('that height is a number', () => {
    expect(isHeightChangeMessage(stub)).toBeTruthy()
    expect(
      isHeightChangeMessage({
        ...stub,
        height: '100vw',
      }),
    ).toBeFalsy()
    expect(
      isHeightChangeMessage({
        ...stub,
        height: undefined,
      }),
    ).toBeFalsy()
  })
})
