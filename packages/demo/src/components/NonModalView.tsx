import { Paper, Stack } from '@mui/material'
import { ModalToggle } from './ModalToggle'
import { ValueMutator } from './ValueMutator'
import { HeightChangeDemo } from './HeightChangeDemo'
import { UpdaterFunctionDemo } from './UpdaterFunctionDemo'
import { AssetSelector } from './AssetSelector'
import { ContextRequester } from './ContextRequester'
import { PluginComponent } from './FieldPluginDemo'

export const NonModalView: PluginComponent = (props) => (
  <Paper>
    <Stack gap={6}>
      <ModalToggle {...props} />
      <ValueMutator {...props} />
      <UpdaterFunctionDemo {...props} />
      <ModalToggle {...props} />
      <AssetSelector {...props} />
      <ContextRequester {...props} />
      <HeightChangeDemo {...props} />
    </Stack>
  </Paper>
)
