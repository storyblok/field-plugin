import type { MessageToContainer } from './MessageToContainer'

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

export type PromptAIMessage = Omit<MessageToContainer<'promptAI'>, 'action'> & {
  action: 'prompt-ai'
  promptAI: PromptAIPayload
}

export const getPromptAIMessage = (
  message: PromptAIPayload,
  options: Pick<PromptAIMessage, 'uid' | 'callbackId'>,
): PromptAIMessage => ({
  action: 'prompt-ai',
  event: 'promptAI',
  ...options,
  promptAI: { ...message },
})
