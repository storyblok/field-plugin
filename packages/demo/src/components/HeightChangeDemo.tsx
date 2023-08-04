import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'
import { useState } from 'react'
import { CenteredContent } from '@storyblok/mui'

const step = 5
const minHeight = step

export const HeightChangeDemo: PluginComponent = (props) => {
  const [height, setHeight] = useState(minHeight)
  const increaseHeight = () => setHeight((height) => height + step)
  const decreaseHeight = () =>
    setHeight((height) => Math.max(height - step, minHeight))
  const resetHeight = () => setHeight(minHeight)
  return (
    <Stack gap={2}>
      <Tooltip title={<>This component changes height</>}>
        <Typography variant="subtitle1">Height</Typography>
      </Tooltip>
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={increaseHeight}
        >
          Increase height
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={decreaseHeight}
        >
          Decrease height
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={resetHeight}
        >
          Reset height
        </Button>
      </Box>
      <CenteredContent sx={{ p: height }}></CenteredContent>
    </Stack>
  )
}
