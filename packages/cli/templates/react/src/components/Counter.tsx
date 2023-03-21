import { FieldPluginFunc } from '../App'

const Counter: FieldPluginFunc = ({ actions, data }) => {
  const label = typeof data.value !== 'number' ? 0 : JSON.stringify(data.value)
  const handleIncrement = () => {
    actions?.setValue((typeof data.value === 'number' ? data.value : 0) + 1)
  }

  return (
    <div className="increment">
      <button onClick={handleIncrement}>Increment</button>
      <span>Value: {label}</span>
    </div>
  )
}

export default Counter
