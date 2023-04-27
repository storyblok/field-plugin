import { FunctionComponent } from 'react'
import { CodeBlock } from './CodeBlock'

/**
 * Displays data as JSON
 * @param props
 * @constructor
 */
export const ObjectView: FunctionComponent<{
  output: unknown
}> = (props) => (
  <CodeBlock>
    {typeof props.output === 'undefined'
      ? 'undefined'
      : JSON.stringify(props.output, undefined, 2)}
  </CodeBlock>
)
