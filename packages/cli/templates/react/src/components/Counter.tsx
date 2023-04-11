import { PluginActions, PluginState } from '@storyblok/field-plugin'
import { FunctionComponent } from 'react'

type Props = {
  setValue: PluginActions['setValue']
  data: PluginState
}

const Counter: FunctionComponent<Props> = ({ setValue, data }) => {
  const label = typeof data.value !== 'number' ? 0 : JSON.stringify(data.value)
  const handleIncrement = () => {
    setValue((typeof data.value === 'number' ? data.value : 0) + 1)
  }

  return (
    <div>
      <h2>Field Value</h2>
      <div className="counter-value">{label}</div>
      <button
        className="btn w-full"
        onClick={handleIncrement}
      >
        Increment
      </button>
    </div>
  )
}

export default Counter
