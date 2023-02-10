import { FunctionComponent, useState } from 'react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { useFieldPlugin } from '../useFieldPlugin'
import { AssetIcon, DeleteIcon, LoadingIcon } from '@storyblok/mui'

export const DemoFieldPlugin: FunctionComponent = () => {
  const [state, actions] = useFieldPlugin()
  const [imageUrl, setImageUrl] = useState<string | undefined>()
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
    <Stack gap={5}>
      <Divider>
        <Typography variant="subtitle1">Field Value</Typography>
      </Divider>
      <Typography textAlign="center">{value ?? 'undefined'}</Typography>
      <Button onClick={() => actions?.setValue((value ?? 0) + 1)}>
        Increment
      </Button>
      <Divider>
        <Typography variant="subtitle1">Asset Selector</Typography>
      </Divider>
      <Box
        height={100}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="text.secondary"
      >
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt="Image selected with the plugin asset selctor"
            height="100%"
          />
        ) : (
          <>
            <Typography>No asset selected</Typography>
          </>
        )}
      </Box>
      {imageUrl ? (
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setImageUrl(undefined)}
        >
          Remove Asset
        </Button>
      ) : (
        <Button
          startIcon={<AssetIcon />}
          onClick={() =>
            actions.selectAsset((filename) => setImageUrl(filename))
          }
        >
          Select Asset
        </Button>
      )}
    </Stack>
  )
}
