import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

const FieldPlugin: FunctionComponent = () => {
  const plugin = useFieldPlugin()

  return <pre>{JSON.stringify(plugin, null, 2)}</pre>
}

export default FieldPlugin
