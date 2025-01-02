import { hasKey } from '../../../utils'
import {
  isMessageToContainer,
  type MessageToContainer,
} from './MessageToContainer'

export type PromptAIAction =
  | 'prompt'
  | 'complete'
  | 'shorten'
  | 'extend'
  | 'rephrase'
  | 'summarize'
  | 'simplify'
  | 'translate'
  | 'tldr'
  | 'adjust-tone'
  | 'emojify'
  | 'fix_spelling_and_grammar'

export const promptAIActionsList: PromptAIAction[] = [
  'prompt',
  'complete',
  'shorten',
  'extend',
  'rephrase',
  'summarize',
  'simplify',
  'translate',
  'tldr',
  'adjust-tone',
  'emojify',
  'fix_spelling_and_grammar',
]

export type PromptAIPayload = {
  action: PromptAIAction
  text: string
  language?: string
  textLength?: string
  tone?: string
  textLengthUnit?: string
}

export type PluginPromptAIMessage = Omit<
  MessageToContainer<'promptAI'>,
  'action'
> & {
  action: 'prompt-ai'
  promptAI: PromptAIPayload
}

export const isPluginPromptAIMessage = (
  obj: unknown,
): obj is PluginPromptAIMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'promptAI' &&
  hasKey(obj, 'promptAI') &&
  isPromptAIPayloadValid(obj.promptAI as PromptAIPayload)

export const getPluginPromptAIMessage = (
  message: PromptAIPayload,
  options: Pick<PluginPromptAIMessage, 'uid' | 'callbackId'>,
): PluginPromptAIMessage => ({
  action: 'prompt-ai',
  event: 'promptAI',
  ...options,
  promptAI: { ...message },
})

const isPromptAIPayloadValid = (promptAIPayload: PromptAIPayload) =>
  promptAIPayload !== null &&
  typeof promptAIPayload === 'object' &&
  hasKey(promptAIPayload, 'action') &&
  typeof promptAIPayload.action === 'string' &&
  hasKey(promptAIPayload, 'text') &&
  typeof promptAIPayload.text === 'string' &&
  promptAIActionsList.includes(promptAIPayload.action)
