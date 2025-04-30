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
  IconButton,
  SxProps,
  Typography,
} from '@mui/material'
import { DisableShieldsNotification } from './DisableShieldsNotification'
import { CloseIcon } from '@storyblok/mui'
import { ModalState } from './FieldPluginSandbox'

const NonPortalModal: FunctionComponent<
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

const FieldTypeSandbox: FunctionComponent<
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
      display: 'flex',
      margin: 'auto',
      width: props.isModal ? '90%' : '100%',
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
      allow="clipboard-read; clipboard-write"
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
    modalState: ModalState
    modalHeight: string
    modalWidth: string
    fullHeight: boolean
    // Allows the iframe to be refreshed
    iframeKey?: number
    sx?: SxProps
    onModalChange: (isModal: boolean) => void
  }
>(function FieldTypePreview(props, ref) {
  const {
    height,
    fullHeight,
    modalState,
    modalHeight,
    modalWidth,
    onModalChange,
  } = props

  const setTeleported = (el: HTMLIFrameElement | null) => {
    if (modalState === 'modal-with-portal') {
      setRef(ref, el)
    }
  }
  const setNonTeleported = (el: HTMLIFrameElement | null) => {
    if (modalState !== 'modal-with-portal') {
      setRef(ref, el)
    }
  }

  const handleClose = () => {
    onModalChange(false)
  }

  return (
    <Box sx={props.sx}>
      <DisableShieldsNotification />
      <Dialog
        open={modalState === 'modal-with-portal'}
        fullScreen
        style={{
          maxWidth: modalWidth,
          maxHeight: modalHeight,
        }}
        sx={{
          padding: 10,
          margin: '0 auto',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
        onClose={handleClose}
      >
        <Box
          width="100%"
          display="flex"
          justifyContent="flex-end"
          padding={1}
        >
          <IconButton
            onClick={handleClose}
            color="secondary"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <FieldPluginIframe
          key={props.iframeKey}
          src={props.src}
          ref={setTeleported}
          fullHeight={fullHeight}
          modal={modalState === 'modal-with-portal'}
          height={height}
        />
      </Dialog>
      {
        // Always render it unless the modal with portal is open; then we don't want to render thois
        modalState !== 'modal-with-portal' && (
          <>
            <Backdrop
              open={modalState === 'modal-without-portal'}
              sx={{ zIndex: ({ zIndex }) => zIndex.drawer }}
            />
            <NonPortalModal isModal={modalState === 'modal-without-portal'}>
              <FieldTypeSandbox isModal={modalState === 'modal-without-portal'}>
                <FieldPluginIframe
                  key={props.iframeKey}
                  src={props.src}
                  ref={setNonTeleported}
                  fullHeight={fullHeight}
                  modal={modalState === 'modal-without-portal'}
                  height={height}
                />
              </FieldTypeSandbox>
            </NonPortalModal>
          </>
        )
      }
    </Box>
  )
})
