import { Stack, styled, Typography } from '@mui/material'
import { ModalToggle } from './ModalToggle'
import { ValueMutator } from './ValueMutator'
import { NumberStack } from './NumberStack'
import { PluginComponent } from './FieldPluginDemo'

const ScrollArea = styled(Stack)(({ theme }) => ({
  overflow: 'auto',
  flex: 1,
  p: theme.spacing(4),
  borderColor: theme.palette.divider,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: theme.shape.borderRadius,
}))

export const ModalView: PluginComponent = (props) => (
  <Stack
    gap={6}
    sx={{
      height: '100vh',
      justifyContent: 'space-between',
    }}
  >
    <ModalToggle {...props} />
    <ValueMutator {...props} />
    <ScrollArea>
      <NumberStack {...props} />
    </ScrollArea>
    <Typography>I am a footer that is positioned at the bottom!</Typography>
  </Stack>
)
