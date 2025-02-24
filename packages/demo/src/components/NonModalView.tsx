import { Paper, Stack } from '@mui/material'
import { ModalToggle } from './ModalToggle'
import { ValueMutator } from './ValueMutator'
import { HeightChangeDemo } from './HeightChangeDemo'
import { AssetSelector } from './AssetSelector'
import { ContextRequester } from './ContextRequester'
import { UserContextRequester } from './UserContextRequester'
import { PluginComponent } from './FieldPluginDemo'
import { LanguageView } from './LanguageView'
import { PromptAI } from './PromptAI'

export const NonModalView: PluginComponent = (props) => (
  <Paper>
    <Stack gap={6}>
      <ModalToggle {...props} />
      <ValueMutator {...props} />
      <AssetSelector {...props} />
      <ContextRequester {...props} />
      <UserContextRequester {...props} />
      <HeightChangeDemo {...props} />
      <LanguageView {...props} />
      <PromptAI {...props} />
    </Stack>
  </Paper>
)
