import { hasKey } from '../../../utils'
import {
  isMessageToContainer,
  type MessageToContainer,
} from './MessageToContainer'

export const promptAIActionsList = [
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
] as const

export type PromptAIAction = (typeof promptAIActionsList)[number]

export type PromptAIPayload = {
  action: PromptAIAction
  text: string
  basedOnCurrentStory?: boolean
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
  promptAIPayload: PromptAIPayload
}

export const isPluginPromptAIMessage = (
  obj: unknown,
): obj is PluginPromptAIMessage =>
  isMessageToContainer(obj) &&
  obj.event === 'promptAI' &&
  hasKey(obj, 'promptAIPayload') &&
  isPromptAIPayloadValid(obj.promptAIPayload as PromptAIPayload)

export const isPromptAIPayloadValid = (promptAIPayload: PromptAIPayload) =>
  promptAIPayload !== null &&
  typeof promptAIPayload === 'object' &&
  hasKey(promptAIPayload, 'action') &&
  typeof promptAIPayload.action === 'string' &&
  hasKey(promptAIPayload, 'text') &&
  typeof promptAIPayload.text === 'string' &&
  promptAIActionsList.includes(promptAIPayload.action) &&
  ((promptAIPayload.action === 'translate' &&
    typeof promptAIPayload.language === 'string' &&
    promptAIPayload.language !== '') ||
    promptAIPayload.action !== 'translate') &&
  ((promptAIPayload.action === 'adjust-tone' &&
    typeof promptAIPayload.tone === 'string' &&
    promptAIPayload.tone !== '') ||
    promptAIPayload.action !== 'adjust-tone')

export const getPluginPromptAIMessage = (
  message: PromptAIPayload,
  options: Pick<PluginPromptAIMessage, 'uid' | 'callbackId'>,
): PluginPromptAIMessage => ({
  action: 'prompt-ai',
  event: 'promptAI',
  ...options,
  promptAIPayload: { ...message },
})
