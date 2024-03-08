import { Checkbox, FormControl, FormLabel } from '@mui/material'
import { FunctionComponent } from 'react'

export const TranslatableCheckbox: FunctionComponent<{
  isTranslatable: boolean | undefined
  setTranslatable: (value: boolean) => void
}> = (props) => {
  return (
    <FormControl>
      <FormLabel htmlFor="translatable-checkbox">Translatable</FormLabel>
      <Checkbox
        sx={{
          alignSelf: 'flex-start',
        }}
        aria-describedby="translatable-checkbox"
        value={props.isTranslatable ?? false}
        onChange={(e) => props.setTranslatable(e.target.checked)}
      />
    </FormControl>
  )
}
