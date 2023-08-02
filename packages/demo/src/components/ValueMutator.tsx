import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ValueMutator: PluginComponent = (props) => {
  const { data, actions } = props

  const handleClickIncrement = () =>
    actions.setContent((content) => content + 1)

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Field Value</Typography>
      <Typography textAlign="center">{data.content}</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickIncrement}
      >
        Increment
      </Button>
    </Stack>
  )
}
