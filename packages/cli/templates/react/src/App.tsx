import FieldPlugin from './components/FieldPlugin'
import { FunctionComponent } from 'react'
import { FieldPluginProvider } from './FieldPluginProvider'

const App: FunctionComponent = () => {
  return (
    <FieldPluginProvider
      Loading={() => <p>Loading...</p>}
      Error={({ error }) => <p>Error: {error.message}</p>}
    >
      <FieldPlugin />
    </FieldPluginProvider>
  )
}

export default App
