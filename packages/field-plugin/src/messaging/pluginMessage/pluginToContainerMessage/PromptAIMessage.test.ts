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
  payload: {
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
    it('has a payload', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
        }),
      ).toEqual(true)
      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: undefined,
        }),
      ).toEqual(false)
    })
    it('has the payload all required fields', () => {
      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: {
            action: '',
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: {
            text: '',
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: {
            action: 'prompt',
            text: 'random text',
          },
        }),
      ).toEqual(true)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: {
            action: 'prompt',
            text: 123,
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: {
            action: null,
            text: 123,
          },
        }),
      ).toEqual(false)

      expect(
        isPluginPromptAIMessage({
          ...stub,
          payload: {
            action: null,
            text: null,
          },
        }),
      ).toEqual(false)
    })
  })
  describe('constructor', () => {
    it('includes the uid', () => {
      expect(
        getPluginPromptAIMessage(stub.payload, { uid, callbackId }),
      ).toHaveProperty('uid', uid)
    })
    it('includes the payload was added to the message', () => {
      expect(
        getPluginPromptAIMessage(stub.payload, { uid, callbackId }),
      ).toHaveProperty('payload')
    })
  })
})
