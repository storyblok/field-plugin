import { Button, Divider, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ContextRequester: PluginComponent = (props) => {
  const { data, actions } = props
  return (
    <Stack gap={2}>
      <Divider>
        <Typography variant="subtitle1">Story</Typography>
      </Divider>
      <Typography textAlign="center">{JSON.stringify(data.story)}</Typography>
      <Button onClick={() => actions.requestContext()}>Request Context</Button>
    </Stack>
  )
}
