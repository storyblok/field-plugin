import { FunctionComponent } from 'react'
import { useFieldPlugin } from '../useFieldPlugin'

const Counter: FunctionComponent = () => {
  const {
    data,
    actions: { setValue },
  } = useFieldPlugin()

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
