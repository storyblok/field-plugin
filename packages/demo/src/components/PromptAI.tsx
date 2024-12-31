import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import {
  promptAIActionsList,
  type PromptAIAction,
} from '@storyblok/field-plugin'
import type { PluginComponent } from './FieldPluginDemo'

export const PromptAI: PluginComponent = (props) => {
  const { actions } = props

  const [promptQuestion, setPromptQuestion] = useState<string>('')
  const [promptType, setPromptType] = useState<PromptAIAction>('prompt')
  const [promptOutput, setPromptOutput] = useState<string>('')

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
        <Select
          value={promptType}
          onChange={(e) => setPromptType(e.target.value as PromptAIAction)}
        >
          {promptAIActionsList.map((promptAIAction) => (
            <MenuItem
              key={promptAIAction}
              value={promptAIAction}
            >
              {promptAIAction}
            </MenuItem>
          ))}
        </Select>
        <Typography>Output: {promptOutput}</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={async () =>
            setPromptOutput(
              await actions.promptAI({
                action: promptType,
                text: promptQuestion,
              }),
            )
          }
        >
          Prompt
        </Button>
      </Stack>
    </Stack>
  )
}
