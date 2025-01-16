import {
  type PromptAIResponseMessage,
  isPromptAIMessage,
} from './PromptAIResponseMessage'

const stub: PromptAIResponseMessage = {
  action: 'prompt-ai',
  uid: '-preview',
  callbackId: 'test-callback-id',
  aiResponse: {
    ok: true,
    answer: 'test-ai-answer',
  },
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
  describe('the aiResponse property', () => {
    it('cannot be undefined', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: undefined,
        }),
      ).toEqual(false)
    })

    it('cannot be null', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: null,
        }),
      ).toEqual(false)
    })

    it('should be an object', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: 'any-string',
        }),
      ).toEqual(false)
    })

    it('should contain an ok property', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            answer: 'any AI answer',
          },
        }),
      ).toEqual(false)
    })

    it('should contain an error property in case of failure', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: 'any error message',
          },
        }),
      ).toEqual(true)
    })

    it('should contain an answer property in case of success', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: 'any AI answer',
          },
        }),
      ).toEqual(true)
    })

    it('error is a string', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: 'any AI answer',
          },
        }),
      ).toEqual(true)

      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: 123,
          },
        }),
      ).toEqual(false)

      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: null,
          },
        }),
      ).toEqual(false)

      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: [],
          },
        }),
      ).toEqual(false)

      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: {},
          },
        }),
      ).toEqual(false)

      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: false,
            error: false,
          },
        }),
      ).toEqual(false)
    })

    it('answer is a string', () => {
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: 'any AI answer',
          },
        }),
      ).toEqual(true)
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: 123,
          },
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: null,
          },
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: [],
          },
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: {},
          },
        }),
      ).toEqual(false)
      expect(
        isPromptAIMessage({
          ...stub,
          aiResponse: {
            ok: true,
            answer: false,
          },
        }),
      ).toEqual(false)
    })
  })
})
