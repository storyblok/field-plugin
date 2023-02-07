import { FunctionComponent } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { useFieldPlugin } from '../useFieldPlugin'
import { LoadingIcon } from '@storyblok/mui'

export const DemoFieldPlugin: FunctionComponent = () => {
  const [state, actions] = useFieldPlugin()
  if (typeof state === 'undefined') {
    return (
      <Box>
        <LoadingIcon />
        <Typography>Not loaded</Typography>
      </Box>
    )
  }

  const { value } = state

  if (typeof value !== 'undefined' && typeof value !== 'number') {
    actions.setValue(0)
    return (
      <Box>
        Hey, why is number not number or undefined? Got: {JSON.stringify(value)}
      </Box>
    )
  }

  return (
    <Stack>
      <Typography>{value ?? 'undefined'}</Typography>
      <Button onClick={() => actions?.setValue((value ?? 0) + 1)}>
        Increment
      </Button>
      <Button
        onClick={() =>
          actions.selectAsset((filename) =>
            console.log('picked a file: ', filename),
          )
        }
      >
        Open Asset Selector
      </Button>
    </Stack>
  )
}
