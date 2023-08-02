import { Button, Stack, Tooltip } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const UpdaterFunctionDemo: PluginComponent = (props) => {
  const { actions } = props

  const handleClickIncrement = () => {
    actions.setContent((content) => content + 1)
    actions.setContent((content) => content + 1)
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
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClickIncrement}
        >
          Increment twice
        </Button>
      </Tooltip>
    </Stack>
  )
}
