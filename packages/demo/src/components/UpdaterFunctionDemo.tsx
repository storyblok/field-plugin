import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const UpdaterFunctionDemo: PluginComponent = (props) => {
  const { data, actions } = props

  const handleClickIncrement = () => {
    actions?.setContent(
      (content) => (typeof content === 'number' ? content : 0) + 1,
    )
    actions?.setContent(
      (content) => (typeof content === 'number' ? content : 0) + 1,
    )
  }
  const label =
    typeof data.content === 'undefined'
      ? 'undefined'
      : JSON.stringify(data.content)

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Field Value</Typography>
      <Typography>
        Increment the counter twice by calling <code>setContent</code> two times
        consecutively in between two renders.
      </Typography>
      <Typography textAlign="center">{label}</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickIncrement}
      >
        Increment twice
      </Button>
    </Stack>
  )
}
