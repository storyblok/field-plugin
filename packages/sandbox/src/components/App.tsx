import { FunctionComponent } from 'react'
import {
  AppContainer,
  AppContent,
  lightTheme,
  NotificationProvider,
} from '@storyblok/mui'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { FieldPluginSandbox } from './FieldPluginSandbox'
import { SandboxAppHeader } from './SandboxAppHeader'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
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
              element={<Navigate to="/field-plugin" />}
            />
            <Route
              path="/field-plugin"
              element={
                <AppContainer>
                  <SandboxAppHeader />
                  <AppContent>
                    <FieldPluginSandbox />
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
