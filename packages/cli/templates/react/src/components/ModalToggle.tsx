import { FunctionComponent } from 'react'
import { useFieldPlugin } from '../useFieldPlugin'

const ModalToggle: FunctionComponent = () => {
  const { data, actions } = useFieldPlugin()

  return (
    <div>
      <h2>Modal</h2>
      <button
        className="btn w-full"
        type="button"
        onClick={() => actions.setModalOpen(!data.isModalOpen)}
      >
        {data.isModalOpen ? 'Close' : 'Open'} modal
      </button>
    </div>
  )
}

export default ModalToggle
