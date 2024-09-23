import { FunctionComponent } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { lightTheme } from '@storyblok/mui'
import { FieldPluginDemo } from './FieldPluginDemo'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { GlobalStyles } from '@mui/material'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <GlobalStyles
      styles={(_theme) => ({
        html: { overflow: 'hidden' },
      })}
    />
    <CssBaseline />
    <FieldPluginDemo />
  </ThemeProvider>
)
