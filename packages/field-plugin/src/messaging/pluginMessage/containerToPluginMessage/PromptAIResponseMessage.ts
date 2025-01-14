import { hasKey } from '../../../utils'
import { isMessageToPlugin, type MessageToPlugin } from './MessageToPlugin'

/**
 * The object returned when calling the "prompt-ai" action.
 */
export type PromptAIResponseMessage = MessageToPlugin<'prompt-ai'> & {
  aiGeneratedText: string
}

export const isPromptAIMessage = (
  data: unknown,
): data is PromptAIResponseMessage =>
  isMessageToPlugin(data) &&
  data.action === 'prompt-ai' &&
  hasKey(data, 'aiGeneratedText') &&
  typeof data.aiGeneratedText === 'string'

export const getResponseFromPromptAIMessage = (
  message: PromptAIResponseMessage,
): string => {
  const { aiGeneratedText } = message
  return aiGeneratedText
}
