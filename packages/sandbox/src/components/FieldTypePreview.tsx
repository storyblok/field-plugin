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

const NonPortalModal: FunctionComponent<
  PropsWithChildren<{
    isNonPortalModalOpen: boolean
  }>
> = (props) => (
  <Box
    sx={
      props.isNonPortalModalOpen
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

const FieldTypeSandbox: FunctionComponent<
  PropsWithChildren<{
    isNonPortalModalOpen: boolean
  }>
> = (props) => (
  <Box
    sx={
      props.isNonPortalModalOpen
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
      display: 'flex',
      margin: 'auto',
      width: props.isNonPortalModalOpen ? '90%' : '100%',
    }}
  >
    {props.children}
  </Box>
)

export const FieldTypePreview = forwardRef<
  HTMLIFrameElement,
  {
    src: string | undefined
    height: number
    isModal: boolean
    enablePortalModal: boolean
    fullHeight: boolean
    // Allows the iframe to be refreshed
    iframeKey?: number
    sx?: SxProps
  }
>(function FieldTypePreview(props, ref) {
  const { height, isModal, fullHeight, enablePortalModal } = props

  const isNonPortalModalOpen = !enablePortalModal && isModal
  const isPortalModalOpen = enablePortalModal && isModal

  return (
    <Box sx={props.sx}>
      <DisableShieldsNotification />
      <Backdrop
        open={props.isModal}
        sx={{ zIndex: ({ zIndex }) => zIndex.drawer }}
      />
      <NonPortalModal isNonPortalModalOpen={isNonPortalModalOpen}>
        <FieldTypeSandbox isNonPortalModalOpen={isNonPortalModalOpen}>
          {typeof props.src !== 'undefined' ? (
            <Box
              ref={ref}
              key={props.iframeKey}
              component="iframe"
              src={props.src}
              title="Field Plugin Preview"
              style={{
                height: fullHeight && isModal ? 'auto' : height,
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
        </FieldTypeSandbox>
      </NonPortalModal>
    </Box>
  )
})
