import { FunctionComponent } from 'react'
import { Box, Typography } from '@mui/material'
import { LoadingIcon, SquareErrorIcon } from '@storyblok/mui'
import { FieldPluginActions, FieldPluginData } from '@storyblok/field-plugin'
import { useFieldPlugin } from '@storyblok/field-plugin/react'
import { ModalView } from './ModalView'
import { NonModalView } from './NonModalView'

const parseContent = (content: unknown) =>
  typeof content === 'number' ? content : 0
type Content = ReturnType<typeof parseContent>

export type PluginComponent = FunctionComponent<{
  data: FieldPluginData<Content>
  actions: FieldPluginActions<Content>
}>

export const FieldPluginDemo: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    parseContent,
  })

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
    <NonModalView {...props} />
  )
}
