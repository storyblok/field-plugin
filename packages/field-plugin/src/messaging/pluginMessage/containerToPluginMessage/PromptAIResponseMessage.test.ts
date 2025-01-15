import {
  type PromptAIResponseMessage,
  isPromptAIMessage,
} from './PromptAIResponseMessage'

const stub: PromptAIResponseMessage = {
  action: 'prompt-ai',
  uid: '-preview',
  callbackId: 'test-callback-id',
  aiGeneratedText: 'test-ai-generated-text',
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
  describe('the aiGeneratedText property', () => {
    it('cannot be undefined', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: undefined,
        }),
      ).toEqual(false)
    })
    it('is a string', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: 'any-string',
        }),
      ).toEqual(true)
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: 123,
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: null,
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: [],
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: {},
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiGeneratedText: false,
        }),
      ).toEqual(false)
    })
  })
})
