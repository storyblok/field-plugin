import { FunctionComponent } from 'react'
import { lightTheme, NotificationProvider } from '@storyblok/mui'
import { Container, CssBaseline, ThemeProvider } from '@mui/material'
import { FieldTypeWrapperAppBar } from './FieldTypeWrapperAppBar'
import { FieldTypeWrapper } from './FieldTypeWrapper'

export const App: FunctionComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <FieldTypeWrapperAppBar />
    <NotificationProvider>
      <Container maxWidth="md">
        <FieldTypeWrapper />
      </Container>
    </NotificationProvider>
  </ThemeProvider>
)
