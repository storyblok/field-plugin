import { PluginActions, PluginState } from '@storyblok/field-plugin'

type Props = {
  setModalOpen: PluginActions['setModalOpen']
  isModalOpen: PluginState['isModalOpen']
}

const ModalToggle = ({ setModalOpen, isModalOpen }: Props) => {
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
