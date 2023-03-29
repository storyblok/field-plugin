import { FunctionComponent } from 'react'
import { SetModalOpen } from '@storyblok/field-plugin'
import Button from './button/Button'

type ModalToggleFunc = FunctionComponent<{
  setModalOpen: SetModalOpen
  isModalOpen: boolean
}>
const ModalToggle: ModalToggleFunc = ({ setModalOpen, isModalOpen }) => {
  const handleToggleModal = (isOpen: boolean) => {
    setModalOpen(isOpen)
  }
  return (
    <div className="modal-toggle">
      <Button onClick={() => handleToggleModal(!isModalOpen)}>
        {isModalOpen ? 'Close' : 'Open'} Modal
      </Button>
    </div>
  )
}

export default ModalToggle
