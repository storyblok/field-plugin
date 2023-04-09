import { useLocalStorage } from 'usehooks-ts'
import { Alert, AlertTitle, Snackbar, Typography } from '@mui/material'

export const DisableShieldsNotification = () => {
  const [open, setOpen] = useLocalStorage('shields-message', true)

  const handleClose = () => setOpen(false)

  return (
    <Snackbar
      open={open}
      sx={{ maxWidth: 'sm' }}
    >
      <Alert
        severity="info"
        onClose={handleClose}
      >
        <AlertTitle>Disable Shields</AlertTitle>
        <Typography>
          Shields and ad-blockers may block the iframe in the preview section.
          Please disable them.
        </Typography>
      </Alert>
    </Snackbar>
  )
}
