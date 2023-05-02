import { FunctionComponent, ReactNode } from 'react'
import { Box, styled } from '@mui/material'

const Pre = styled('pre')(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  overflowX: 'auto',
  padding: theme.spacing(3),
  margin: 0,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(4),
  // padding: theme.spacing(3),
  '& .CodeBlock-actions': {
    transition: theme.transitions.create('opacity'),
    opacity: 0,
  },
  '&:hover': {
    '& .CodeBlock-actions': {
      opacity: 1,
    },
  },
}))
const Code = styled('code')(({ theme }) => ({
  backgroundColor: 'inherit',
  color: 'inherit',
}))

/**
 * Displays data as JSON, except in case of if undefined when it renders just `undefined`
 * @param props
 * @constructor
 */
export const ObjectView: FunctionComponent<{
  output: unknown
  actions?: ReactNode
}> = (props) => (
  <Pre
    sx={{
      minHeight: typeof props.actions !== 'undefined' && 70,
    }}
  >
    {typeof props.actions !== 'undefined' && (
      <Box
        className="CodeBlock-actions"
        sx={{
          padding: 'inherit',
          position: 'absolute',
          right: 0,
          top: 0,
        }}
      >
        {props.actions}
      </Box>
    )}
    <Code>
      {typeof props.output === 'undefined'
        ? 'undefined'
        : JSON.stringify(props.output, undefined, 2)}
    </Code>
  </Pre>
)
