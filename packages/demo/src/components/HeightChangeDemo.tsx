import { Box, Button, Stack, Tooltip, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'
import { useState } from 'react'
import { CenteredContent, HelpIcon } from '@storyblok/mui'

const step = 5
const minHeight = step

export const HeightChangeDemo: PluginComponent = (_props) => {
  const [height, setHeight] = useState(minHeight)
  const increaseHeight = () => setHeight((height) => height + step)
  const decreaseHeight = () =>
    setHeight((height) => Math.max(height - step, minHeight))
  const resetHeight = () => setHeight(minHeight)
  return (
    <Stack gap={2}>
      <Typography
        variant="subtitle1"
        sx={{ display: 'inline-flex' }}
      >
        Height
        <Tooltip
          title={
            <>This component denstrates what happens when the height changes</>
          }
        >
          <Box component="span">
            {/*  HelpIcon does not forward ref, so we need to wrap with a Box */}
            <HelpIcon />
          </Box>
        </Tooltip>
      </Typography>
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
