import { useState } from 'react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { AssetIcon, DeleteIcon } from '@storyblok/mui'
import { PluginComponent } from './FieldPluginDemo'

export const AssetSelector: PluginComponent = (props) => {
  const { actions } = props
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  return (
    <Stack gap={2}>
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
        {typeof imageUrl !== 'undefined' ? (
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
      {typeof imageUrl !== 'undefined' ? (
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
          onClick={async () => setImageUrl(await actions.selectAsset())}
        >
          Select Asset
        </Button>
      )}
    </Stack>
  )
}
