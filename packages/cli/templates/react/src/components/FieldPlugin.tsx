import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

const FieldPlugin: FunctionComponent = () => {
  const plugin = useFieldPlugin({
    enablePortalModal: true,
    /*
    The `validateContent` parameter is optional. It allows you to
      - validate the content
      - make changes before sending it to the Storyblok Visual Editor
      - provide type-safety

    // For example,
    validateContent: (content: unknown) => {
      if (typeof content === 'string') {
        return {
          content,
        }
      } else {
        return {
          content,
          error: `content is expected to be a string (actual value: ${JSON.stringify(content)})`,
        }
      }
    }
    */
  })

  return <pre>{JSON.stringify(plugin, null, 2)}</pre>
}

export default FieldPlugin
