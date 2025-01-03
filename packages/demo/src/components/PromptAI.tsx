import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import {
  isPromptAIPayloadValid,
  promptAIActionsList,
  type PromptAIAction,
} from '@storyblok/field-plugin'
import type { PluginComponent } from './FieldPluginDemo'

export const PromptAI: PluginComponent = (props) => {
  const { actions } = props

  const [promptQuestion, setPromptQuestion] = useState<string>('')
  const [promptAction, setPromptAction] = useState<PromptAIAction>('prompt')
  const [promptLanguage, setPromptLanguage] = useState<string>()
  const [promptTone, setPromptTone] = useState<string>()
  const [promptOutput, setPromptOutput] = useState<string>()

  const onSubmit = async () => {
    const payload = {
      action: promptAction,
      text: promptQuestion,
      language: promptLanguage,
      tone: promptTone,
    }

    if (!isPromptAIPayloadValid(payload)) {
      console.error('Invalid Prompt AI payload')
      return
    }

    const output = await actions.promptAI(payload)

    setPromptOutput(output)
  }

  return (
    <Stack
      gap={2}
      direction={'column'}
    >
      <Typography variant="subtitle1">Prompt AI</Typography>
      <Stack gap={2}>
        <TextField
          label="Ask a question"
          onChange={(e) => setPromptQuestion(e.target.value)}
          required
        />
        <TextField
          label="Action"
          value={promptAction}
          select
          required
          onChange={(e) => setPromptAction(e.target.value as PromptAIAction)}
        >
          {promptAIActionsList.map((promptAIAction) => (
            <MenuItem
              key={promptAIAction}
              value={promptAIAction}
            >
              {promptAIAction}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Language (optional)"
          onChange={(e) => setPromptLanguage(e.target.value)}
        />
        <TextField
          label="Tone (optional)"
          onChange={(e) => setPromptTone(e.target.value)}
        />
        <Typography>Output: {promptOutput}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onSubmit}
        >
          Prompt
        </Button>
      </Stack>
    </Stack>
  )
}
