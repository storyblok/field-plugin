import {
  ContextRequestMessage,
  isContextRequestMessage,
} from './ContextRequestMessage'

const stub: ContextRequestMessage = {
  uid: 'abc',
  story: { content: {} },
  action: 'get-context',
  callbackId: 'test-callback-id',
}

describe('ContextRequestMessage', () => {
  it('should validate', () => {
    expect(isContextRequestMessage(stub)).toEqual(true)
  })

  describe('The "action" property', () => {
    it('equals "get-context"', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          action: 'anotherString',
        }),
      ).toEqual(false)
    })
  })

  describe('the "uid" property', () => {
    it('is a string', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          uid: 'anything',
        }),
      ).toEqual(true)
    })

    it('is not undefined', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          uid: undefined,
        }),
      ).toEqual(false)
    })

    it('is not null', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          uid: null,
        }),
      ).toEqual(false)
    })

    it('is not a number', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          uid: 123,
        }),
      ).toEqual(false)
    })
  })

  describe('the "story" property', () => {
    it('is not undefined', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          story: undefined,
        }),
      ).toEqual(false)
    })

    it('is not null', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          story: null,
        }),
      ).toEqual(false)
    })
  })

  describe('the "callbackId" property', () => {
    it('is not undefined', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          callbackId: undefined,
        }),
      ).toEqual(false)
    })

    it('is not null', () => {
      expect(
        isContextRequestMessage({
          ...stub,
          callbackId: null,
        }),
      ).toEqual(false)
    })
  })
})
