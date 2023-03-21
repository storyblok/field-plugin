import { FieldPluginFunc } from '../App'

const ModalToggle: FieldPluginFunc = ({ actions, data }) => {
  const handleToggleModal = (isOpen: boolean) => {
    actions?.setModalOpen(isOpen)
  }
  return (
    <div className="modal-toggle">
      <button onClick={() => handleToggleModal(!data.isModalOpen)}>
        {data.isModalOpen ? 'Close' : 'Open'} modal
      </button>
    </div>
  )
}

export default ModalToggle
