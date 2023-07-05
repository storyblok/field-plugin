import FieldPlugin from './components/FieldPlugin'
import FieldPluginExample from './components/FieldPluginExample'
import { FunctionComponent } from 'react'
import { FieldPluginProvider } from '@storyblok/field-plugin/react'

const App: FunctionComponent = () => {
  return (
    <FieldPluginProvider
      Loading={Loading}
      Error={Error}
    >
      <FieldPluginExample />
    </FieldPluginProvider>
  )
}

const Loading: FunctionComponent = () => <p>Loading...</p>
const Error: FunctionComponent<{ error: Error }> = (props) => {
  console.error(props.error)
  return <p>An error occured, please see the console for more details.</p>
}
export default App
