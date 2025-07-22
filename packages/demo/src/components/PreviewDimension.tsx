import { Button, Input, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'
import { useState } from 'react'

export const PreviewDimension: PluginComponent = (props) => {
  const { data, actions } = props

  const label =
    typeof data.content === 'undefined'
      ? 'undefined'
      : JSON.stringify(data.content)

  const [width, setWidth] = useState(300)

  const handleClickMobile = () => {
    actions.setPreviewDimension({
      tag: 'mobile',
    })
  }
  const handleClickTablet = () => {
    actions.setPreviewDimension({
      tag: 'tablet',
    })
  }
  const handleClickDesktop = () => {
    actions.setPreviewDimension({
      tag: 'desktop',
    })
  }
  const handleClickCustom = () => {
    actions.setPreviewDimension({
      tag: 'custom',
      width: width,
    })
  }

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Field Value</Typography>
      <Typography textAlign="center">{label}</Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickMobile}
      >
        Mobile
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickTablet}
      >
        Tablet
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickDesktop}
      >
        Desktop
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClickCustom}
      >
        Custom
      </Button>
      <Input
        type="number"
        value={width}
        onChange={(e) => setWidth(Number(e.target.value))}
        placeholder="Custom Width"
      />
    </Stack>
  )
}
