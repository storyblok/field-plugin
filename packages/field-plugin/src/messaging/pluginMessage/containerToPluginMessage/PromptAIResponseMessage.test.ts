import {
  type PromptAIResponseMessage,
  isPromptAIMessage,
} from './PromptAIResponseMessage'

const stub: PromptAIResponseMessage = {
  action: 'prompt-ai',
  uid: '-preview',
  callbackId: 'test-callback-id',
  output: 'test-output',
}

describe('PromptAIResponseMessage', function () {
  it('is a message to plugin', () => {
    expect(isPromptAIMessage(stub)).toEqual(true)
  })
  describe('the action property', () => {
    it('equals "prompt-ai"', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          action: 'prompt-ai',
        }),
      ).toEqual(true)
      expect(
        isPromptAIMessage({
          ...stub,
          action: 'something-else',
        }),
      ).toEqual(false)
    })
  })
  describe('the output property', () => {
    it('cannot be undefined', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          output: undefined,
        }),
      ).toEqual(false)
    })
    it('is a string', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          output: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isPromptAIMessage({
          ...stub,
          output: 123,
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          output: null,
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          output: [],
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          output: {},
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          output: false,
        }),
      ).toEqual(false)
    })
  })
})
