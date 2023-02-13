import { isMessageToContainer, MessageToContainer } from './MessageToContainer'

const uid = '-preview-abc-123'
const event = 'dummy-event-3478'
const stub: MessageToContainer<typeof event> = {
  action: 'plugin-changed',
  uid,
  event,
}

describe('message from plugin to container', () => {
  describe('validator', () => {
    describe('the action property', () => {
      it('is "plugin-changed"', () => {
        expect(
          isMessageToContainer({
            ...stub,
            action: 'plugin-changed',
          }),
        ).toBeTruthy()
        expect(
          isMessageToContainer({
            ...stub,
            action: 'something-different',
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            action: undefined,
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            action: 123,
          }),
        ).toBeFalsy()
      })
    })
    describe('the uid property', () => {
      it('requires uid', () => {
        expect(
          isMessageToContainer({
            ...stub,
            uid: 'abc',
          }),
        ).toBeTruthy()
        expect(
          isMessageToContainer({
            ...stub,
            uid: undefined,
          }),
        ).toBeFalsy()
      })
      it('requires uid to be a string', () => {
        expect(
          isMessageToContainer({
            ...stub,
            uid: 'abc',
          }),
        ).toBeTruthy()
        expect(
          isMessageToContainer({
            ...stub,
            uid: undefined,
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            uid: 123,
          }),
        ).toBeFalsy()
      })
    })
    describe('the event property', () => {
      it('is a string', () => {
        expect(
          isMessageToContainer({
            ...stub,
            event: 'any-string',
          }),
        ).toBeTruthy()
        expect(
          isMessageToContainer({
            ...stub,
            event: 123,
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            event: undefined,
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            event: true,
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            event: false,
          }),
        ).toBeFalsy()
        expect(
          isMessageToContainer({
            ...stub,
            event: null,
          }),
        ).toBeFalsy()
      })
    })
  })
})
