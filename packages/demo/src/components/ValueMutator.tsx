import { Button, Divider, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ValueMutator: PluginComponent = (props) => {
  const { data, actions } = props

  const handleClickIncrement = () =>
    actions?.setValue((typeof data.value === 'number' ? data.value : 0) + 1)
  const label =
    typeof data.value === 'undefined' ? 'undefined' : JSON.stringify(data.value)

  return (
    <Stack gap={2}>
      <Divider>
        <Typography variant="subtitle1">Field Value</Typography>
      </Divider>
      <Typography textAlign="center">{label}</Typography>
      <Button onClick={handleClickIncrement}>Increment</Button>
    </Stack>
  )
}
