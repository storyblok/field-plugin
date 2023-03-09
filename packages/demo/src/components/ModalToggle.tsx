import {
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const ModalToggle: PluginComponent = (props) => {
  const { data, actions } = props
  return (
    <Stack gap={2}>
      <Divider>
        <Typography variant="subtitle1">Modal</Typography>
      </Divider>
      <FormControlLabel
        control={<Switch defaultChecked />}
        checked={data.isModalOpen}
        onChange={() => actions.setModalOpen(!data.isModalOpen)}
        label="Modal"
        sx={{
          justifyContent: 'center',
        }}
      />
    </Stack>
  )
}