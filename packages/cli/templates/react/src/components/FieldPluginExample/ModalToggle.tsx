import { FunctionComponent } from 'react'
import type { SetModalOpen } from '@storyblok/field-plugin'

const ModalToggle: FunctionComponent<{
  isModalOpen: boolean
  setModalOpen: SetModalOpen<number>
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
