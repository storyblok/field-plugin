import { FunctionComponent } from 'react'
import { useFieldPlugin } from '../../useFieldPlugin'

const ModalToggle: FunctionComponent = () => {
  const {
    data: { isModalOpen },
    actions: { setModalOpen },
  } = useFieldPlugin()

  return (
    <div>
      <h2>Modal</h2>
      <button
        className="btn w-full"
        type="button"
        onClick={() => setModalOpen(!isModalOpen)}
      >
        {isModalOpen ? 'Close' : 'Open'} modal
      </button>
    </div>
  )
}

export default ModalToggle
