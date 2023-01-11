import { FunctionComponent, useEffect, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
hljs.registerLanguage('json', json)
import 'highlight.js/styles/github.css'
import { Box } from '@mui/material'

export const JsonCode: FunctionComponent<{
  json: string
}> = (props) => {
  const [innerHtml, setInnerHtml] = useState<string>()
  useEffect(() => {
    setInnerHtml(hljs.highlight(props.json, { language: 'json' }).value)
    return () => {
      setInnerHtml(undefined)
    }
  }, [props.json])
  return (
    <Box
      component="pre"
      sx={{
        bgcolor: 'grey.A100',
        borderRadius: 2,
        overflowX: 'auto',
        p: 2,
      }}
    >
      <code dangerouslySetInnerHTML={{ __html: innerHtml ?? '' }}></code>
    </Box>
  )
}
