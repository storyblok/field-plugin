import { FunctionComponent } from 'react'
import { Box, Typography } from '@mui/material'
import { useFieldPlugin } from '../useFieldPlugin'
import { LoadingIcon, SquareErrorIcon } from '@storyblok/mui'
import { FieldPluginActions, FieldPluginData } from '@storyblok/field-plugin'
import { ModalView } from './ModalView'
import { NonModalView } from './NonModalView'

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

  return props.data.isModalOpen ? (
    <ModalView {...props} />
  ) : (
    <NonModalView {...props} />=
  )
}
