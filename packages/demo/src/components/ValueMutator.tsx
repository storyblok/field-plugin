import { Button, Divider, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ValueMutator: PluginComponent = (props) => {
  const { data } = props
  const onClickIncrement = () =>
    props.actions?.setValue(
      (typeof props.data.value === 'number' ? props.data.value : 0) + 1,
    )
  return (
    <Stack gap={2}>
      <Divider>
        <Typography variant="subtitle1">Field Value</Typography>
      </Divider>
      <Typography textAlign="center">
        {typeof data.value === 'undefined'
          ? 'undefined'
          : JSON.stringify(data.value)}
      </Typography>
      <Button onClick={onClickIncrement}>Increment</Button>
    </Stack>
  )
}
