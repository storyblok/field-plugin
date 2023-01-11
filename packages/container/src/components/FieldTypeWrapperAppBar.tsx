import { FunctionComponent } from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'
import { StoryblokLogo } from './StoryblokLogo'

export const FieldTypeWrapperAppBar: FunctionComponent = () => (
  <AppBar position="relative">
    <Toolbar>
      <StoryblokLogo />
      <Typography
        variant="h4"
        component="h1"
      >
        Field Type Wrapper
      </Typography>
    </Toolbar>
  </AppBar>
)
