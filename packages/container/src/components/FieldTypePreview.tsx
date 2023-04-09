import { forwardRef, FunctionComponent, PropsWithChildren } from 'react'
import { Backdrop, Box } from '@mui/material'

const Iframe = forwardRef<
  HTMLIFrameElement,
  {
    src: string
    height: string
    isModal: boolean
  }
>(function Iframe(props, ref) {
  return (
    <Box
      component="iframe"
      ref={ref}
      style={{
        height: props.height,
        width: '100%',
        flex: 1,
        border: 'none',
      }}
      src={props.src}
    />
  )
})

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
            resize: 'horizontal',
            p: 1,
            maxWidth: '100%',
            minWidth: '100px',
          }
    }
    style={{
      margin: 'auto',
      width: props.isModal ? '90%' : '300px',
    }}
  >
    {props.children}
  </Box>
)

export const FieldTypePreview = forwardRef<
  HTMLIFrameElement,
  {
    src: string
    height: string
    isModal: boolean
    // Allows the iframe to be refreshed
    uid?: string
  }
>(function FieldTypePreview(props, ref) {
  return (
    <>
      <Backdrop
        open={props.isModal}
        sx={{ zIndex: ({ zIndex }) => zIndex.drawer }}
      />
      <FieldTypeModal isModal={props.isModal}>
        <FieldTypeContainer isModal={props.isModal}>
          <Iframe
            {...props}
            ref={ref}
            key={props.uid}
          />
        </FieldTypeContainer>
      </FieldTypeModal>
    </>
  )
})
