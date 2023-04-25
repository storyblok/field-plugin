import { FunctionComponent } from 'react'
import { lightTheme, NotificationProvider } from '@storyblok/mui'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { FieldPluginContainerAppBar } from './FieldPluginContainerAppBar'
import { FieldPluginContainer } from './FieldPluginContainer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'
import { QueryParamProvider } from 'use-query-params'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <FieldPluginContainerAppBar />
    <NotificationProvider>
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <Routes>
            <Route
              path="/"
              element={
                <Container
                  maxWidth="md"
                  sx={{ py: 10 }}
                >
                  <FieldPluginContainer />
                </Container>
              }
            />
          </Routes>
        </QueryParamProvider>
      </BrowserRouter>
    </NotificationProvider>
  </ThemeProvider>
)
