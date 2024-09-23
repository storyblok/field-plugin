import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Box, Stack, styled, Typography } from '@mui/material'
import hljs from 'highlight.js/lib/core'
import hljsJson from 'highlight.js/lib/languages/json'
import './_hljs.scss'

const Root = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  borderRadius: theme.shape.borderRadius * 2,
  overflowX: 'auto',
  '& .CodeBlock-actions': {
    transition: theme.transitions.create('opacity'),
    opacity: 0,
    display: 'flex',
    justifyContent: 'center',
  },
  '&:hover': {
    '& .CodeBlock-actions': {
      opacity: 1,
    },
  },
}))

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  borderBottom: `1px solid ${theme.palette.text.secondary}`,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}))

const Pre = styled('pre')(({ theme }) => ({
  margin: 0,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: theme.spacing(4),
}))

export const Code = styled('code')(() => ({
  backgroundColor: 'inherit',
  color: 'inherit',
  m: 0,
}))

/**
 * Displays data as JSON, except in case of if undefined when it renders just `undefined`
 * @param props
 * @constructor
 */
export const ObjectView: FunctionComponent<{
  output: unknown
  actions?: ReactNode
  title?: ReactNode
}> = (props) => {
  const { output } = props
  const json = useMemo(
    () =>
      typeof output === 'undefined'
        ? 'undefined'
        : JSON.stringify(output, undefined, 2),
    [output],
  )

  const [innerHtml, setInnerHtml] = useState<string | undefined>()
  useEffect(() => {
    hljs.registerLanguage('json', hljsJson)
    setInnerHtml(hljs.highlight(json, { language: 'json' }).value)
    return () => {
      setInnerHtml(undefined)
    }
  }, [json])

  return (
    <Root>
      {typeof props.title !== 'undefined' && (
        <Header>
          <Typography variant="subtitle1">{props.title}</Typography>
          <Box className="CodeBlock-actions">{props.actions}</Box>
        </Header>
      )}
      <Pre
        sx={{
          p: 3,
        }}
      >
        <Code
          dangerouslySetInnerHTML={
            typeof innerHtml !== 'undefined' ? { __html: innerHtml } : undefined
          }
        />
      </Pre>
    </Root>
  )
}
