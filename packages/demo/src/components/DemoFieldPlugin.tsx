import {FunctionComponent} from "react";
import {Box, Button, Stack, Typography} from "@mui/material";
import {useFieldPlugin} from "../useFieldPlugin";
import {LoadingIcon} from "@storyblok/mui";

export const DemoFieldPlugin: FunctionComponent = () => {
  const [state, actions] = useFieldPlugin()
  if(typeof state === 'undefined'){
    return (<Box>
      <LoadingIcon />
      <Typography>Not loaded</Typography>
    </Box>)
  }
  return <Stack>
    <Typography>
      {state.value ?? 'undefined'}
    </Typography>
    <Button onClick={() => actions?.setValue((state.value ?? 0) + 1)}>Increment</Button>
  </Stack>
}