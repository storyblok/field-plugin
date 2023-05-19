import { useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { AssetIcon, DeleteIcon } from '@storyblok/mui'
import { PluginComponent } from './FieldPluginDemo'
import { Asset } from '@storyblok/field-plugin'

export const AssetSelector: PluginComponent = (props) => {
  const { actions } = props
  const [asset, setAsset] = useState<Asset | undefined>()
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">Asset Selector</Typography>
      <Box
        height={100}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="text.secondary"
      >
        {typeof asset !== 'undefined' ? (
          <Box
            component="img"
            src={asset.filename}
            alt="Image selected with the plugin asset selctor"
            height="100%"
          />
        ) : (
          <>
            <Typography>No asset selected</Typography>
          </>
        )}
      </Box>
      {typeof asset !== 'undefined' ? (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={() => setAsset(undefined)}
        >
          Remove Asset
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<AssetIcon />}
          onClick={async () => setAsset(await actions.selectAsset())}
        >
          Select Asset
        </Button>
      )}
    </Stack>
  )
}
