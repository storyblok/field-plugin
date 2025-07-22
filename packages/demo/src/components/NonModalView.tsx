import { Divider, Paper, Stack } from '@mui/material'
import { ModalToggle } from './ModalToggle'
import { ValueMutator } from './ValueMutator'
import { HeightChangeDemo } from './HeightChangeDemo'
import { AssetSelector } from './AssetSelector'
import { ContextRequester } from './ContextRequester'
import { UserContextRequester } from './UserContextRequester'
import { PluginComponent } from './FieldPluginDemo'
import { LanguageView } from './LanguageView'
import { PromptAI } from './PromptAI'
import { PreviewDimension } from './PreviewDimension'

export const NonModalView: PluginComponent = (props) => (
  <Paper>
    <Stack gap={6}>
      <ModalToggle {...props} />
      <Divider />
      <ValueMutator {...props} />
      <Divider />
      <AssetSelector {...props} />
      <Divider />
      <ContextRequester {...props} />
      <Divider />
      <UserContextRequester {...props} />
      <Divider />
      <HeightChangeDemo {...props} />
      <Divider />
      <LanguageView {...props} />
      <Divider />
      <PromptAI {...props} />
      <Divider />
      <PreviewDimension {...props} />
    </Stack>
  </Paper>
)
