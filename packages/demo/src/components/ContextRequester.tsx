import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ContextRequester: PluginComponent = (props) => {
  const { data, actions } = props
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Story: </Typography>
      <Typography textAlign="center">
        {JSON.stringify(data.story, null, 2)}
      </Typography>
      <Typography variant="subtitle1">Is AI enabled: </Typography>
      <Typography textAlign="center">
        {data.isAIEnabled ? 'Yes' : 'No'}
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => actions.requestContext()}
      >
        Request Context
      </Button>
    </Stack>
  )
}
