import { FunctionComponent } from 'react'

const ModalToggle: FunctionComponent<{
  isModalOpen: boolean
  setModalOpen: (isModalOpen: boolean) => void
}> = ({ isModalOpen, setModalOpen }) => {
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
