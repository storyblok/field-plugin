import { useFieldPlugin } from './useFieldPlugin'
import { FunctionComponent } from 'react'
import Counter from './components/Counter'
import ModalToggle from './components/ModalToggle'
import AssetSelector from './components/AssetSelector'
import { PluginActions, PluginState } from '@storyblok/field-plugin'

export type FieldPluginFunc = FunctionComponent<{
  data: PluginState
  actions: PluginActions
}>

function App() {
  const { type, data, actions } = useFieldPlugin()

  if (type === 'loading') {
    return <span>Loading...</span>
  }

  if (type === 'error') {
    return <span>Error</span>
  }

  const props = {
    data,
    actions,
  }

  return (
    <div className="field-plugin">
      <ModalToggle {...props} />
      <Counter {...props} />
      <AssetSelector {...props} />
    </div>
  )
}

export default App
