import { FunctionComponent } from 'react'
import {
  AppContainer,
  lightTheme,
  NotificationProvider,
  AppContent,
} from '@storyblok/mui'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { FieldPluginContainer } from './FieldPluginContainer'
import { SandboxAppHeader } from './SandboxAppHeader'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <NotificationProvider>
      <AppContainer>
        <SandboxAppHeader />
        <AppContent>
          <Container maxWidth="md">
            <FieldPluginContainer />
          </Container>
        </AppContent>
      </AppContainer>
    </NotificationProvider>
  </ThemeProvider>
)
