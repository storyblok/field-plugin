import { FunctionComponent } from 'react'
import { AppBar, ListItemButton, Toolbar, Typography } from '@mui/material'
import { StoryblokLogo } from './StoryblokLogo'
import { AppHeader, DropMenu, RescueIcon, StoryblokIcon } from '@storyblok/mui'

export const SandboxAppHeader: FunctionComponent = () => (
  <AppHeader
    icon={
      <StoryblokIcon
        fontSize="inherit"
        color="primary"
      />
    }
    title="Field Plugin Sandbox"
    subtitle="A development environment for Storyblok field plugins."
  >
    <DropMenu
      color="secondary"
      variant="outlined"
      startIcon={<RescueIcon />}
      label="Help"
    >
      <ListItemButton
        component="a"
        href="https://github.com/storyblok/field-plugin/blob/main/README.md"
      >
        Documentation
      </ListItemButton>
    </DropMenu>
  </AppHeader>
)
