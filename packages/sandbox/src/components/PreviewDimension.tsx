import { FunctionComponent } from 'react'
import { PreviewDimensionChangeMessage } from '@storyblok/field-plugin'
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material'

export const PreviewDimension: FunctionComponent<{
  previewDimension: PreviewDimensionChangeMessage['data']
}> = (props) => {
  const { previewDimension } = props

  let customLabel = 'Custom'
  if (previewDimension.tag === 'custom') {
    customLabel += ` (${previewDimension.width})`
  }
  
  return (
    <FormControl disabled>
      <FormLabel id="demo-radio-buttons-group-label">
        Preview Dimension
      </FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={previewDimension.tag}
      >
        <FormControlLabel
          value="desktop"
          control={<Radio />}
          label="Desktop"
        />
        <FormControlLabel
          value="tablet"
          control={<Radio />}
          label="Tablet"
        />
        <FormControlLabel
          value="mobile"
          control={<Radio />}
          label="Mobile"
        />
        <FormControlLabel
          value="custom"
          control={<Radio />}
          label={customLabel}
        />
      </RadioGroup>
    </FormControl>
  )
}
