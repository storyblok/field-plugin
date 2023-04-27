import { styled } from '@mui/material'
import { FunctionComponent } from 'react'
import { PropsOf } from '@emotion/react'

const Pre = styled('pre')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  overflowX: 'auto',
  padding: theme.spacing(2),
  margin: 0,
}))
const Code = styled('code')(({ theme }) => ({
  backgroundColor: 'inherit',
  color: 'inherit',
}))

export const CodeBlock: FunctionComponent<PropsOf<typeof Pre>> = (props) => {
  return (
    <Pre>
      <Code>{props.children}</Code>
    </Pre>
  )
}
