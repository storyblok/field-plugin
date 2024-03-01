import { FunctionComponent } from 'react'
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  SxProps,
  Tooltip,
} from '@mui/material'
import { RefreshIcon } from '@storyblok/mui'

export const UrlView: FunctionComponent<{
  sx?: SxProps
  url: string
  setUrl: (url: string) => void
  onRefresh: () => void
  error: boolean
  placeholder: string
}> = (props) => (
  <FormControl
    sx={props.sx}
    error={props.error}
  >
    <InputLabel
      htmlFor="field-plugin-url"
      shrink
    >
      Field Plugin URL
    </InputLabel>
    <OutlinedInput
      id="field-plugin-url"
      aria-describedby="field-plugin-url-description"
      size="small"
      label="Field Plugin URL"
      value={props.url}
      onChange={(e) => props.setUrl(e.target.value)}
      placeholder={props.placeholder}
      endAdornment={
        <Tooltip title="Reload plugin">
          <IconButton
            size="small"
            onClick={props.onRefresh}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      }
    />
    <FormHelperText id="my-helper-text">
      Please enter a valid URL from where a field plugin is served.
    </FormHelperText>
  </FormControl>
)
