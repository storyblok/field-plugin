import { forwardRef, FunctionComponent, PropsWithChildren } from 'react'
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  SxProps,
  Typography,
} from '@mui/material'
import { DisableShieldsNotification } from './DisableShieldsNotification'

const FieldTypeModal: FunctionComponent<
  PropsWithChildren<{
    isModal: boolean
  }>
> = (props) => (
  <Box
    sx={
      props.isModal
        ? {
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: ({ zIndex }) => zIndex.modal,
          }
        : {}
    }
  >
    {props.children}
  </Box>
)

const FieldTypeContainer: FunctionComponent<
  PropsWithChildren<{
    isModal: boolean
  }>
> = (props) => (
  <Box
    sx={
      props.isModal
        ? {
            bgcolor: 'background.paper',
            p: 6,
            borderRadius: 1,
            height: '80%',
            overflowY: 'auto',
          }
        : {
            overflow: 'auto',
            p: 1,
            maxWidth: '100%',
            minWidth: '100px',
          }
    }
    style={{
      margin: 'auto',
      width: props.isModal ? '90%' : '100%',
    }}
  >
    {props.children}
  </Box>
)

export const FieldTypePreview = forwardRef<
  HTMLIFrameElement,
  {
    src: string | undefined
    height: string
    isModal: boolean
    // Allows the iframe to be refreshed
    uid?: string
    sx?: SxProps
  }
>(function FieldTypePreview(props, ref) {
  return (
    <Box sx={props.sx}>
      <DisableShieldsNotification />
      <Backdrop
        open={props.isModal}
        sx={{ zIndex: ({ zIndex }) => zIndex.drawer }}
      />
      <FieldTypeModal isModal={props.isModal}>
        <FieldTypeContainer isModal={props.isModal}>
          {typeof props.src !== 'undefined' ? (
            <Box
              ref={ref}
              key={props.uid}
              component="iframe"
              src={props.src}
              title="Field Plugin Preview"
              style={{
                height: props.height,
                width: '100%',
                flex: 1,
                border: 'none',
              }}
            />
          ) : (
            <Alert
              severity="error"
              sx={{
                width: '100%',
              }}
            >
              <AlertTitle>Unable to Load Field Plugin</AlertTitle>
              <Typography>Please enter a valid URL.</Typography>
            </Alert>
          )}
        </FieldTypeContainer>
      </FieldTypeModal>
    </Box>
  )
})
