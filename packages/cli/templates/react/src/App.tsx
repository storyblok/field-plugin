import { useFieldPlugin } from './useFieldPlugin'
import FieldPlugin from './components/FieldPlugin'

function App() {
  const { type, data, actions } = useFieldPlugin()

  if (type === 'loading') {
    return <span>Loading...</span>
  }

  if (type === 'error') {
    return <span>Error</span>
  }

  return type === 'loaded' ? (
    <FieldPlugin
      data={data}
      actions={actions}
    />
  ) : null
}

export default App
