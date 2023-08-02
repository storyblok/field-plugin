import { FunctionComponent } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '@storyblok/mui'
import { FieldPluginDemo } from './FieldPluginDemo'
import { FieldPluginProvider } from './context'

export const App: FunctionComponent = () => (
  <FieldPluginProvider>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <FieldPluginDemo />
    </ThemeProvider>
  </FieldPluginProvider>
)
