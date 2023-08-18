import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

const Counter: FunctionComponent = () => {
  const {
    data,
    actions: { setContent },
  } = useFieldPlugin()

  const label =
    typeof data.content !== 'number' ? 0 : JSON.stringify(data.content)
  const handleIncrement = () => {
    setContent((typeof data.content === 'number' ? data.content : 0) + 1)
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
