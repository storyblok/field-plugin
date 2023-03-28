import { useFieldPlugin } from './useFieldPlugin'
import Counter from './components/Counter'
import ModalToggle from './components/ModalToggle'
import AssetSelector from './components/AssetSelector'

function App() {
  const { type, data, actions } = useFieldPlugin()

  if (type === 'loading') {
    return <span>Loading...</span>
  }

  if (
    type === 'error' ||
    (typeof data === 'undefined' && typeof actions === 'undefined')
  ) {
    return <span>Error</span>
  }

  return (
    <div className="field-plugin">
      <ModalToggle
        isModalOpen={data.isModalOpen}
        setModalOpen={actions.setModalOpen}
      />
      <Counter
        setValue={actions.setValue}
        value={data.value}
      />
      <AssetSelector selectAsset={actions.selectAsset} />
    </div>
  )
}

export default App
