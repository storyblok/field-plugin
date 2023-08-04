import { Button, Stack, Tooltip, Typography } from '@mui/material'
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

  return (
    <Stack gap={2}>
      <Tooltip
        title={
          <>
            Increment the counter twice by calling <code>setContent</code> two
            times consecutively in between two renders.
          </>
        }
      >
        <Typography variant="subtitle1">Updater Function</Typography>
      </Tooltip>
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
