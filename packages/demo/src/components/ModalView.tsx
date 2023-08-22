import { Box, IconButton, Stack, styled, Typography } from '@mui/material'
import { HeightChangeDemo } from './HeightChangeDemo'
import { PluginComponent } from './FieldPluginDemo'
import { CloseIcon } from '@storyblok/mui'

const ScrollArea = styled(Stack)(({ theme }) => ({
  overflow: 'auto',
  flex: 1,
  padding: theme.spacing(4),
  borderColor: theme.palette.divider,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: theme.shape.borderRadius,
}))

export const ModalView: PluginComponent = (props) => (
  <Stack
    sx={{
      height: '100vh',
      justifyContent: 'space-between',
      gap: 6,
    }}
  >
    <Box display="flex">
      <Typography variant="subtitle1">
        I am a header that is positioned at the top!
      </Typography>
      <Box flex={1} />
      <IconButton
        color="secondary"
        onClick={() => props.actions.setModalOpen(false)}
      >
        <CloseIcon />
      </IconButton>
    </Box>
    <ScrollArea>
      <HeightChangeDemo {...props} />
    </ScrollArea>
    <Typography variant="subtitle1">
      I am a footer that is positioned at the bottom!
    </Typography>
  </Stack>
)
