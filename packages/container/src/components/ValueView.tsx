import { FunctionComponent } from 'react'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { DeleteIcon } from '@storyblok/mui'
import { ObjectView } from './ObjectView'

export const ValueView: FunctionComponent<{
  value: unknown
  setValue: (value: unknown) => void
}> = (props) => (
  <Stack gap={2}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <Typography variant="h3">Content</Typography>
      <Tooltip title="Reset value">
        <IconButton
          aria-label="Reset value"
          color="secondary"
          size="small"
          onClick={() => props.setValue(undefined)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>
    <ObjectView output={props.value} />
  </Stack>
)
