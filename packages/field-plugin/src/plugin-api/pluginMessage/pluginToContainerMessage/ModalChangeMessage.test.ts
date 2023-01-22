import { isMessageToContainer } from './MessageToContainer'
import { isModalChangeMessage, ModalChangeMessage } from './ModalChangeMessage'

const stub: ModalChangeMessage = {
  action: 'plugin-changed',
  event: 'toggleModal',
  uid: '-prevew',
  status: true,
}

describe('ModalChangeMessage', () => {
  it('is a MessageToContainer', () => {
    expect(isMessageToContainer(stub)).toBeTruthy()
  })
  it('has a status', () => {
    expect(
      isModalChangeMessage({
        ...stub,
        status: true,
      }),
    ).toBeTruthy()
    expect(
      isModalChangeMessage({
        ...stub,
        status: undefined,
      }),
    ).toBeFalsy()
  })
  test('that the status is a boolean', () => {
    expect(
      isModalChangeMessage({
        ...stub,
        status: true,
      }),
    ).toBeTruthy()
    expect(
      isModalChangeMessage({
        ...stub,
        status: false,
      }),
    ).toBeTruthy()
    expect(
      isModalChangeMessage({
        ...stub,
        status: 'false',
      }),
    ).toBeFalsy()
    expect(
      isModalChangeMessage({
        ...stub,
        status: 123,
      }),
    ).toBeFalsy()
    expect(
      isModalChangeMessage({
        ...stub,
        status: null,
      }),
    ).toBeFalsy()
    expect(
      isModalChangeMessage({
        ...stub,
        status: undefined,
      }),
    ).toBeFalsy()
  })
})
