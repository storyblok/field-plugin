import { FunctionComponent } from 'react'
import { FormControl, InputLabel, OutlinedInput, SxProps } from '@mui/material'

export const LanguageView: FunctionComponent<{
  sx?: SxProps
  language: string
  setLanguage: (language: string) => void
}> = (props) => (
  <FormControl sx={props.sx}>
    <InputLabel
      htmlFor="field-plugin-language"
      shrink
    >
      Language (optional)
    </InputLabel>
    <OutlinedInput
      id="field-plugin-language"
      aria-describedby="field-plugin-language-description"
      size="small"
      value={props.language}
      onChange={(e) => props.setLanguage(e.target.value)}
    />
  </FormControl>
)
