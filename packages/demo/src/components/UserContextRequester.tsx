import { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { PluginComponent } from './FieldPluginDemo'
import { UserData } from '@storyblok/field-plugin'

export const UserContextRequester: PluginComponent = (props) => {
  const { actions } = props
  const [user, setUser] = useState<UserData>({
    isSpaceAdmin: false,
    permissions: undefined,
  })
  return (
    <Stack gap={2}>
      <Typography variant="subtitle1">User data: </Typography>
      <Typography>Permissions: </Typography>
      <Typography textAlign="center">
        {JSON.stringify(user.permissions, null, 2)}
      </Typography>
      <Typography>Is space admin? </Typography>
      <Typography textAlign="center">
        {user.isSpaceAdmin ? 'Yes' : 'No'}
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        onClick={async () => setUser(await actions.requestUserContext())}
      >
        Request User Context
      </Button>
    </Stack>
  )
}
