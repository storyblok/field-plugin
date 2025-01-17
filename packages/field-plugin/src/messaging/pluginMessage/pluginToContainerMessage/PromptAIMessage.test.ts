import { isMessageToContainer } from './MessageToContainer'
import {
  getPluginPromptAIMessage,
  isPluginPromptAIMessage,
  type PluginPromptAIMessage,
} from './PromptAIMessage'

const uid = '-preview-abc-123'
const callbackId = 'test-callback-id'
const stub: PluginPromptAIMessage = {
  action: 'prompt-ai',
  event: 'promptAI',
  uid,
  promptAIPayload: {
    action: 'prompt',
    text: 'Some text to prompt',
  },
}

describe('PromptAIMessage', () => {
  describe('validator', () => {
    it('is a MessageToContainer', () => {
      expect(isMessageToContainer(stub)).toEqual(true)
    })
    it('requires event to be "promptAI"', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
          event: 'promptAI',
        }),
      ).toEqual(true)
      expect(
        isPluginPromptAIMessage({
          ...stub,
          event: 'somethingElse',
        }),
      ).toEqual(false)
    })
    it('has a promptAIPayload', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
        }),
      ).toEqual(true)
      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: undefined,
        }),
      ).toEqual(false)
    })
    it('has the promptAIPayload all required fields', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            action: '',
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            text: '',
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            action: 'prompt',
            text: 'random text',
          },
        }),
      ).toEqual(true)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            action: 'prompt',
            text: 123,
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            action: null,
            text: 123,
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            action: null,
            text: null,
          },
        }),
      ).toEqual(false)
    })
    it('has the promptAIPayload a language in case of translation', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            ...stub.promptAIPayload,
            action: 'translate',
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            ...stub.promptAIPayload,
            action: 'translate',
            language: 'en',
          },
        }),
      ).toEqual(true)
    })
    it('has the promptAIPayload a tone in case of tone adjustment', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            ...stub.promptAIPayload,
            action: 'adjust-tone',
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          promptAIPayload: {
            ...stub.promptAIPayload,
            action: 'adjust-tone',
            tone: 'academic',
          },
        }),
      ).toEqual(true)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(
        getPluginPromptAIMessage(stub.promptAIPayload, { uid, callbackId }),
      ).toHaveProperty('uid', uid)
    })
    it('includes the promptAIPayload', () => {
      expect(
        getPluginPromptAIMessage(stub.promptAIPayload, { uid, callbackId }),
      ).toHaveProperty('promptAIPayload')
    })
  })
})
