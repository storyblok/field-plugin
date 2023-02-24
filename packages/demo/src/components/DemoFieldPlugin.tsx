import { FunctionComponent, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import { useFieldPlugin } from '../useFieldPlugin'
import {
  AssetIcon,
  DeleteIcon,
  LoadingIcon,
  SquareErrorIcon,
} from '@storyblok/mui'

export const DemoFieldPlugin: FunctionComponent = () => {
  const { isLoading, error, data, actions } = useFieldPlugin()
  const [imageUrl, setImageUrl] = useState<string | undefined>()

  if (isLoading) {
    return (
      <Box>
        <LoadingIcon />
        <Typography>Not loaded</Typography>
      </Box>
    )
  }
  if (error) {
    return (
      <Box>
        <SquareErrorIcon />
        <Typography>Error</Typography>
      </Box>
    )
  }

  const { value } = data

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
        <Typography variant="subtitle1">Modal</Typography>
      </Divider>
      <FormControlLabel
        control={<Switch defaultChecked />}
        checked={data.isModalOpen}
        onChange={() => actions.setModalOpen(!data.isModalOpen)}
        label="Modal"
        sx={{
          justifyContent: 'center',
        }}
      />
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
          onClick={() =>
            actions.selectAsset((filename) => setImageUrl(filename))
          }
        >
          Select Asset
        </Button>
      )}
      <Divider>
        <Typography variant="subtitle1">Story</Typography>
      </Divider>
      <Typography textAlign="center">{JSON.stringify(data.story)}</Typography>
      <Button onClick={() => actions.requestContext()}>Request Context</Button>
    </Stack>
  )
}
