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
          Shields and ad blockers may prevent the embedded field plugin from
          loading. If you cannot see your field plugin in the preview section,
          please disable ad blockers and shields for this site.
        </Typography>
      </Alert>
    </Snackbar>
  )
}
