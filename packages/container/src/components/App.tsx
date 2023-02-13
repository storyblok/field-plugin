import { FunctionComponent } from 'react'
import { lightTheme, NotificationProvider } from '@storyblok/mui'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { FieldPluginContainerAppBar } from './FieldPluginContainerAppBar'
import { FieldPluginContainer } from './FieldPluginContainer'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <FieldPluginContainerAppBar />
    <NotificationProvider>
      <Container maxWidth="md">
        <FieldPluginContainer />
      </Container>
    </NotificationProvider>
  </ThemeProvider>
)
