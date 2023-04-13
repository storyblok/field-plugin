import FieldPlugin from './components/FieldPlugin'
import { FunctionComponent } from 'react'
import { FieldPluginProvider } from './FieldPluginProvider'

const App: FunctionComponent = () => {
  return (
    <FieldPluginProvider
      loading={() => <span>Loading...</span>}
      error={() => <span>Error</span>}
    >
      <FieldPlugin />
    </FieldPluginProvider>
  )
}

export default App
