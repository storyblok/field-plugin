import { hasKey } from '../../../utils'
import { isMessageToPlugin, type MessageToPlugin } from './MessageToPlugin'

/**
 * The object returned when calling the "prompt-ai" action.
 */
export type PromptAIResponse =
  | { ok: true; answer: string }
  | { ok: false; error: string }

export type PromptAIResponseMessage = MessageToPlugin<'prompt-ai'> & {
  aiResponse: PromptAIResponse
}

export const isPromptAIMessage = (
  data: unknown,
): data is PromptAIResponseMessage =>
  isMessageToPlugin(data) &&
  data.action === 'prompt-ai' &&
  hasKey(data, 'aiResponse') &&
  typeof data.aiResponse === 'object' &&
  data.aiResponse !== null &&
  hasKey(data.aiResponse, 'ok') &&
  typeof data.aiResponse.ok === 'boolean' &&
  (data.aiResponse.ok
    ? hasKey(data.aiResponse, 'answer') &&
      typeof data.aiResponse.answer === 'string'
    : hasKey(data.aiResponse, 'error') &&
      typeof data.aiResponse.error === 'string')

export const getResponseFromPromptAIMessage = (
  message: PromptAIResponseMessage,
) => {
  const { aiResponse } = message
  return aiResponse
}
