import { hasKey } from '../../../utils'
import { isMessageToPlugin, type MessageToPlugin } from './MessageToPlugin'

/**
 * The object returned when calling the "prompt-ai" action.
 */
export type PromptAIResponseMessage = MessageToPlugin<'prompt-ai'> & {
  output: string
}

export const isPromptAIMessage = (
  data: unknown,
): data is PromptAIResponseMessage =>
  isMessageToPlugin(data) &&
  data.action === 'prompt-ai' &&
  hasKey(data, 'output') &&
  typeof data.output === 'string'

export const getResponseFromPromptAIMessage = (
  message: PromptAIResponseMessage,
): string => {
  const { output } = message
  return output
}
