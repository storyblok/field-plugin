import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ModalToggle: PluginComponent = (props) => {
  const { actions, data } = props
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Modal</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() =>
          actions.setModalOpen(!data.isModalOpen, { width: '50%' })
        }
      >
        Toggle Modal
      </Button>
    </Stack>
  )
}
