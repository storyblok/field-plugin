import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
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
  const [promptAIGeneratedText, setPromptAIGeneratedText] = useState<string>()
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

    const promptAIGeneratedText = await actions.promptAI(payload)

    setPromptAIGeneratedText(promptAIGeneratedText)
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
          <FormLabel htmlFor="based-on-current-story-checkbox">
            Based on the current story:
          </FormLabel>
          <Checkbox
            id="based-on-current-story-checkbox"
            value={promptBasedOnCurrentStory}
            onChange={(e) => setPromptBasedOnCurrentStory(e.target.checked)}
          />
        </FormControl>
        <Typography>AI Generated Text: {promptAIGeneratedText}</Typography>
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
