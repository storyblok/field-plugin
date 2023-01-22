import { isMessageToContainer } from './MessageToContainer'
import { GetContextMessage, isGetContextMessage } from './GetContextMessage'

const stub: GetContextMessage = {
  action: 'plugin-changed',
  event: 'getContext',
  uid: '-prevew',
}

describe('ValueChangeMessage', () => {
  it('is a MessageToContainer', () => {
    expect(isMessageToContainer(stub)).toBeTruthy()
  })
  it('requires event to be "getContext"', () => {
    expect(
      isGetContextMessage({
        ...stub,
        event: 'getContext',
      }),
    ).toBeTruthy()
    expect(
      isGetContextMessage({
        ...stub,
        event: 'somethingElse',
      }),
    ).toBeFalsy()
  })
})
