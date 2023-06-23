import { Stack, Typography } from '@mui/material'
import { zeros } from '../utils'
import { PluginComponent } from './FieldPluginDemo'

export const NumberStack: PluginComponent = (props) => (
  <Stack>
    {zeros(typeof props.data.content === 'number' ? props.data.content : 0).map(
      (_, index) => (
        <Typography key={index}>{index}</Typography>
      ),
    )}
  </Stack>
)
