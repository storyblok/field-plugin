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
        ).toEqual(true)
        expect(
          isMessageToContainer({
            ...stub,
            action: 'something-different',
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            action: undefined,
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            action: 123,
          }),
        ).toEqual(false)
      })
    })
    describe('the uid property', () => {
      it('requires uid', () => {
        expect(
          isMessageToContainer({
            ...stub,
            uid: 'abc',
          }),
        ).toEqual(true)
        expect(
          isMessageToContainer({
            ...stub,
            uid: undefined,
          }),
        ).toEqual(false)
      })
      it('requires uid to be a string', () => {
        expect(
          isMessageToContainer({
            ...stub,
            uid: 'abc',
          }),
        ).toEqual(true)
        expect(
          isMessageToContainer({
            ...stub,
            uid: undefined,
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            uid: 123,
          }),
        ).toEqual(false)
      })
    })
    describe('the event property', () => {
      it('is a string', () => {
        expect(
          isMessageToContainer({
            ...stub,
            event: 'any-string',
          }),
        ).toEqual(true)
        expect(
          isMessageToContainer({
            ...stub,
            event: 123,
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            event: undefined,
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            event: true,
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            event: false,
          }),
        ).toEqual(false)
        expect(
          isMessageToContainer({
            ...stub,
            event: null,
          }),
        ).toEqual(false)
      })
    })
  })
})
