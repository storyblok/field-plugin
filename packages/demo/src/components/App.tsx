import {FunctionComponent} from "react";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {lightTheme} from "@storyblok/mui";
import {DemoFieldPlugin} from "./DemoFieldPlugin";

export const App: FunctionComponent = () =>
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <DemoFieldPlugin />
  </ThemeProvider>