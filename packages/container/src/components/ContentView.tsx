import { FunctionComponent } from 'react'
import { Button, ButtonGroup, Tooltip, Typography } from '@mui/material'
import { DeleteIcon } from '@storyblok/mui'
import { ObjectView } from './ObjectView'

export const ContentView: FunctionComponent<{
  content: unknown
  setContent: (content: unknown) => void
}> = (props) => (
  <ObjectView
    title={
      <Typography variant="caption">
        FieldPluginResponse.data.content
      </Typography>
    }
    output={props.content}
    actions={<Actions onRemove={() => props.setContent(undefined)} />}
  />
)

const Actions: FunctionComponent<{
  onRemove?: () => void
}> = (props) => (
  <ButtonGroup
    variant="text"
    color="inherit"
    size="small"
  >
    <Tooltip title="Reset value">
      <Button
        aria-label="Reset value"
        onClick={props.onRemove}
        sx={{ p: 0 }}
      >
        <DeleteIcon />
      </Button>
    </Tooltip>
  </ButtonGroup>
)
