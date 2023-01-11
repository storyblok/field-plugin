import { FunctionComponent } from 'react'
import { JsonCode } from './JsonCode'

/**
 * Displays data as JSON
 * @param props
 * @constructor
 */
export const ObjectDisplay: FunctionComponent<{
  output: unknown
}> = (props) => (
  <JsonCode
    json={
      typeof props.output === 'undefined'
        ? 'undefined'
        : JSON.stringify(props.output, undefined, 2)
    }
  />
)
