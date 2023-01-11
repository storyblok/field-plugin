import { ChangeEvent, FunctionComponent } from 'react'
import { Box, Divider, IconButton, InputBase } from '@mui/material'
import { DeleteIcon, HandleIcon } from '@storyblok/mui'
import { FieldTypeOption } from '@storyblok/field-plugin'

export const OptionEditor: FunctionComponent<{
  option: FieldTypeOption
  setOption: (option: FieldTypeOption) => void
  removeOption: () => void
}> = (props) => {
  const handleChangeName = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) =>
    props.setOption({
      ...props.option,
      name: e.target.value,
    })
  const handleChangeValue = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) =>
    props.setOption({
      ...props.option,
      value: e.target.value,
    })
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <HandleIcon />
      <Box
        component="fieldset"
        sx={{
          borderColor: 'divider',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderRadius: 1,
          p: 0,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <InputBase
          placeholder="Key"
          value={props.option.name}
          onChange={handleChangeName}
          sx={{
            pl: 3,
            pr: 3,
            pt: 2,
            pb: 2,
            bgcolor: 'background.paper',
          }}
        />
        <Divider
          orientation="vertical"
          flexItem
        />
        <InputBase
          placeholder="Value"
          value={props.option.value}
          onChange={handleChangeValue}
          sx={{
            bgcolor: 'background.paper',
            pl: 3,
            pr: 3,
            pt: 2,
            pb: 2,
          }}
        />
      </Box>
      <IconButton
        onClick={props.removeOption}
        color="inherit"
        sx={{ borderRadius: 1 }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  )
}
