import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ValueMutator: PluginComponent = (props) => {
  const { data, actions } = props

  const handleClickIncrement = () =>
    actions?.setContent(
      (typeof data.content === 'number' ? data.content : 0) + 1,
    )
  const handleClickReset = () => actions?.setContent(0)

  const label =
    typeof data.content === 'undefined'
      ? 'undefined'
      : JSON.stringify(data.content)

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Field Value</Typography>
      <Typography textAlign="center">{label}</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickIncrement}
      >
        Increment
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickReset}
      >
        Reset
      </Button>
    </Stack>
  )
}
