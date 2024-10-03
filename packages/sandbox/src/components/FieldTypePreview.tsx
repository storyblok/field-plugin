import {
  ForwardedRef,
  forwardRef,
  FunctionComponent,
  PropsWithChildren,
} from 'react'
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Dialog,
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

const FieldPluginIframe = forwardRef<
  HTMLIFrameElement,
  {
    src: string | undefined
    fullHeight: boolean
    modal: boolean
    height: number
  }
>(function FieldPluginIframe(props, ref) {
  const { src, fullHeight, modal, height } = props

  if (typeof src === 'undefined') {
    return (
      <Alert
        severity="error"
        sx={{
          width: '100%',
        }}
      >
        <AlertTitle>Unable to Load Field Plugin</AlertTitle>
        <Typography>Please enter a valid URL.</Typography>
      </Alert>
    )
  }

  return (
    <Box
      ref={ref}
      component="iframe"
      src={src}
      title="Field Plugin Preview"
      style={{
        height: fullHeight && modal ? 'auto' : height,
        width: '100%',
        flex: 1,
        border: 'none',
      }}
    />
  )
})

const setRef = <T,>(ref: ForwardedRef<T>, value: T | null) => {
  if (ref === null) {
    return
  } else if (typeof ref === 'function') {
    ref(value)
  } else {
    ref.current = value
  }
}

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

  const setTeleported = (el: HTMLIFrameElement | null) => {
    if (isPortalModalOpen) {
      setRef(ref, el)
    }
  }
  const setNonTeleported = (el: HTMLIFrameElement | null) => {
    if (!isPortalModalOpen) {
      setRef(ref, el)
    }
  }

  return (
    <Box sx={props.sx}>
      <DisableShieldsNotification />
      <Dialog
        open={isPortalModalOpen}
        fullScreen
        sx={{
          padding: 10,
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <FieldPluginIframe
          key={props.iframeKey}
          src={props.src}
          ref={setTeleported}
          fullHeight={fullHeight}
          modal={isModal}
          height={height}
        />
      </Dialog>
      <Backdrop
        open={isNonPortalModalOpen}
        sx={{ zIndex: ({ zIndex }) => zIndex.drawer }}
      />
      <NonPortalModal isNonPortalModalOpen={isNonPortalModalOpen}>
        <FieldTypeSandbox isNonPortalModalOpen={isNonPortalModalOpen}>
          {!isPortalModalOpen && (
            <FieldPluginIframe
              key={props.iframeKey}
              src={props.src}
              ref={setNonTeleported}
              fullHeight={fullHeight}
              modal={isModal}
              height={height}
            />
          )}
        </FieldTypeSandbox>
      </NonPortalModal>
    </Box>
  )
})
