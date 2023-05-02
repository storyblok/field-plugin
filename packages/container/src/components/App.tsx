import { FunctionComponent } from 'react'
import {
  AppContainer,
  lightTheme,
  NotificationProvider,
  AppContent,
} from '@storyblok/mui'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { FieldPluginContainer } from './FieldPluginContainer'
import { SandboxAppHeader } from './SandboxAppHeader'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { QueryParamProvider } from 'use-query-params'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <NotificationProvider>
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Routes>
            <Route
              path="/"
              element={
                <AppContainer>
                  <SandboxAppHeader />
                  <AppContent>
                    <FieldPluginContainer />
                  </AppContent>
                </AppContainer>
              }
            />
          </Routes>
        </QueryParamProvider>
      </BrowserRouter>
    </NotificationProvider>
  </ThemeProvider>
)
