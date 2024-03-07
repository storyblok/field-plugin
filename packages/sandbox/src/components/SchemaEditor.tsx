import { FunctionComponent } from 'react'
import {
  Button,
  Container,
  List,
  ListItem,
  ListSubheader,
  Stack,
} from '@mui/material'
import { FieldPluginOption, FieldPluginSchema } from '@storyblok/field-plugin'
import { PlusIcon } from '@storyblok/mui'
import { OptionEditor } from './OptionEditor'

export const SchemaEditor: FunctionComponent<{
  schema: FieldPluginSchema
  setSchema: (options: FieldPluginSchema) => void
}> = (props) => {
  const handleAddOption = () => {
    props.setSchema({
      ...props.schema,
      options: [
        ...props.schema.options,
        {
          name: '',
          value: '',
        },
      ],
    })
  }
  const handleRemoveOption = (option: FieldPluginOption) => () => {
    props.setSchema({
      ...props.schema,
      options: props.schema.options.filter((o) => o !== option),
    })
  }
  const handleChangeOption =
    (option: FieldPluginOption) => (newValue: FieldPluginOption) => {
      const index = props.schema.options.indexOf(option)
      props.setSchema({
        ...props.schema,
        options: [
          ...props.schema.options.slice(0, index),
          newValue,
          ...props.schema.options.slice(index + 1, props.schema.options.length),
        ],
      })
    }

  return (
    <Container
      maxWidth="md"
      sx={{
        bgcolor: ({ palette }) => palette.grey.A100,
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack>
        <List
          subheader={
            <ListSubheader
              component="div"
              sx={{
                color: 'inherit',
                bgcolor: 'inherit',
              }}
            >
              Options
            </ListSubheader>
          }
        >
          {props.schema.options.map((option, index) => (
            <ListItem key={index}>
              <OptionEditor
                option={option}
                setOption={handleChangeOption(option)}
                removeOption={handleRemoveOption(option)}
              />
            </ListItem>
          ))}
        </List>
        <Button
          sx={{
            alignSelf: 'flex-start',
          }}
          size="small"
          variant="text"
          startIcon={<PlusIcon />}
          onClick={handleAddOption}
        >
          Add Option
        </Button>
      </Stack>
    </Container>
  )
}
