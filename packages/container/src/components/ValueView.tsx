import { FunctionComponent } from 'react'
import { Box, Button, ButtonGroup, styled, Tooltip } from '@mui/material'
import { DeleteIcon } from '@storyblok/mui'
import { ObjectView } from './ObjectView'

const Root = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(4),
  // padding: theme.spacing(3),
  '& .ValueView-actions': {
    transition: theme.transitions.create('opacity'),
    opacity: 0,
  },
  '&:hover': {
    '& .ValueView-actions': {
      opacity: 1,
    },
  },
}))

export const ValueView: FunctionComponent<{
  value: unknown
  setValue: (value: unknown) => void
}> = (props) => (
  <ObjectView
    output={props.value}
    actions={<Actions onRemove={() => props.setValue(undefined)} />}
  />
)

const Actions: FunctionComponent<{
  onRemove?: () => void
}> = (props) => (
  <ButtonGroup
    variant="outlined"
    color="inherit"
    size="small"
    sx={{ bgcolor: 'background.paper' }}
  >
    <Tooltip title="Reset value">
      <Button
        sx={{
          color: 'text.secondary',
          p: 1,
        }}
        aria-label="Reset value"
        onClick={props.onRemove}
      >
        <DeleteIcon />
      </Button>
    </Tooltip>
  </ButtonGroup>
)
