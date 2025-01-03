import { useState } from 'react'
import { Button, Stack, Typography, Input, Grid } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'
import type { ModalSize } from '@storyblok/field-plugin'

export const ModalToggle: PluginComponent = (props) => {
  const { actions, data } = props
  const [modalSize, setModalSize] = useState<ModalSize>({
    width: '50%',
    height: '100%',
  })

  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Modal</Typography>
      <Grid
        container
        spacing={2}
      >
        <Grid
          xs={6}
          item
        >
          <Typography>Set modal width: </Typography>
          <Input
            value={modalSize.width}
            fullWidth
            onChange={(e) =>
              setModalSize({ ...modalSize, width: e.target.value })
            }
          />{' '}
        </Grid>
        <Grid
          xs={6}
          item
        >
          <Typography>Set modal height: </Typography>
          <Input
            value={modalSize.height}
            fullWidth
            onChange={(e) =>
              setModalSize({ ...modalSize, height: e.target.value })
            }
          />
        </Grid>
      </Grid>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => actions.setModalOpen(!data.isModalOpen, modalSize)}
      >
        Toggle Modal
      </Button>
    </Stack>
  )
}
