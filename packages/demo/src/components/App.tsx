import { FunctionComponent } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '@storyblok/mui'
import { FieldPluginDemo } from './FieldPluginDemo'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <FieldPluginDemo />
  </ThemeProvider>
)
