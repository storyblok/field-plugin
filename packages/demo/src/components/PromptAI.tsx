import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import {
  isPromptAIPayloadValid,
  promptAIActionsList,
  PromptAIResponse,
  type PromptAIAction,
} from '@storyblok/field-plugin'
import type { PluginComponent } from './FieldPluginDemo'

export const PromptAI: PluginComponent = (props) => {
  const { actions } = props

  const [promptQuestion, setPromptQuestion] = useState<string>('')
  const [promptAction, setPromptAction] = useState<PromptAIAction>('prompt')
  const [promptLanguage, setPromptLanguage] = useState<string>()
  const [promptTone, setPromptTone] = useState<string>()
  const [promptAIResponse, setPromptAIResponse] = useState<PromptAIResponse>()
  const [promptBasedOnCurrentStory, setPromptBasedOnCurrentStory] =
    useState<boolean>(false)

  const onSubmit = async () => {
    const payload = {
      action: promptAction,
      text: promptQuestion,
      language: promptLanguage,
      tone: promptTone,
      basedOnCurrentStory: promptBasedOnCurrentStory,
    }

    if (!isPromptAIPayloadValid(payload)) {
      console.error('Invalid Prompt AI payload')
      return
    }

    const promptAIResponse = await actions.promptAI(payload)

    setPromptAIResponse(promptAIResponse)
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
        <FormControl>
          <FormControlLabel
            label="Based on the current story"
            control={
              <Checkbox
                value={promptBasedOnCurrentStory}
                onChange={(e) => setPromptBasedOnCurrentStory(e.target.checked)}
              />
            }
            sx={{ ml: '-9px' }}
          />
        </FormControl>
        <Typography>
          {promptAIResponse?.ok === true &&
            `AI Generated Text: ${promptAIResponse.answer}`}
          {promptAIResponse?.ok === false &&
            `AI Error: ${promptAIResponse.error}`}
        </Typography>
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
