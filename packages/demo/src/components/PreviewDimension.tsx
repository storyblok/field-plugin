import { Button, Input, Stack, Typography, InputLabel } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'
import { useState } from 'react'

export const PreviewDimension: PluginComponent = (props) => {
  const { data, actions } = props

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
      <Typography variant="subtitle1">Dimension</Typography>
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
      <InputLabel
        htmlFor="field-plugin-custom-width"
        shrink
      >
        Set custom width:
      </InputLabel>
      <Stack direction="row" spacing={2} >
        <Input
          id="field-plugin-custom-width"
          fullWidth
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          placeholder="Custom Width"
        />
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={handleClickCustom}
        >
          Custom
        </Button>
      </Stack>
    </Stack>
  )
}
