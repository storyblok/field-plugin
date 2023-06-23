import { Paper, Stack } from '@mui/material'
import { ModalToggle } from './ModalToggle'
import { ValueMutator } from './ValueMutator'
import { NumberStack } from './NumberStack'
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
      <NumberStack {...props} />
      <ModalToggle {...props} />
      <AssetSelector {...props} />
      <ContextRequester {...props} />
    </Stack>
  </Paper>
)
