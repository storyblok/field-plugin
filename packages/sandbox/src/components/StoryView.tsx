import { FunctionComponent } from 'react'
import { StoryData } from '@storyblok/field-plugin'
import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material'
import { ObjectView } from './ObjectView'

export const StoryView: FunctionComponent<{
  story: StoryData
  onMutateStory: () => void
}> = (props) => (
  <Stack gap={2}>
    <Typography variant="h3">Story</Typography>
    <ObjectView output={props.story} />
    <Alert severity="info">
      <AlertTitle>Note</AlertTitle>
      Mutating the story does not automatically update the field plugin. You
      need to click on the Request Context button. Click on the button below to
      mutate the story.
    </Alert>
    <Button
      onClick={props.onMutateStory}
      size="small"
      color="secondary"
      endIcon={'+1'}
    >
      Mutate Story
    </Button>
  </Stack>
)
