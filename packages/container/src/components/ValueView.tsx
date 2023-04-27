import { FunctionComponent } from 'react'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { DeleteIcon } from '@storyblok/mui'
import { ObjectDisplay } from './ObjectDisplay'

export const ValueView: FunctionComponent<{
  value: unknown
  setValue: (value: unknown) => void
}> = (props) => (
  <Stack>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="h3">Value</Typography>
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

    <ObjectDisplay output={props.value} />
  </Stack>
)
