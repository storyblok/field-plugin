import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ModalToggle: PluginComponent = (props) => {
  const { actions } = props
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Modal</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => actions.setModalOpen(!props.data.isModalOpen)}
      >
        Toggle Modal
      </Button>
    </Stack>
  )
}
