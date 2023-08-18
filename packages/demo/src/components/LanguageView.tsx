import { Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'

export const LanguageView: PluginComponent = (props) => {
  const { data } = props

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Language</Typography>
      <Typography textAlign="center">{data.storyLang}</Typography>
    </Stack>
  )
}
