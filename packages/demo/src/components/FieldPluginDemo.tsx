import { FunctionComponent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { useFieldPlugin } from '../useFieldPlugin'
import { LoadingIcon, SquareErrorIcon } from '@storyblok/mui'
import { FieldPluginActions, FieldPluginData } from '@storyblok/field-plugin'
import { ValueMutator } from './ValueMutator'
import { ModalToggle } from './ModalToggle'
import { AssetSelector } from './AssetSelector'
import { ContextRequester } from './ContextRequester'

export type PluginComponent = FunctionComponent<{
  data: FieldPluginData
  actions: FieldPluginActions
}>

export const FieldPluginDemo: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin()

  if (type === 'loading') {
    return (
      <Box>
        <LoadingIcon />
        <Typography>Not loaded</Typography>
      </Box>
    )
  }
  if (type === 'error') {
    return (
      <Box>
        <SquareErrorIcon />
        <Typography>Error</Typography>
      </Box>
    )
  }

  const props = {
    data,
    actions,
  }
  return (
    <Stack gap={4}>
      <ValueMutator {...props} />
      <ModalToggle {...props} />
      <AssetSelector {...props} />
      <ContextRequester {...props} />
    </Stack>
  )
}
