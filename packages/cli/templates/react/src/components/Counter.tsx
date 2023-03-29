import { FunctionComponent } from 'react'
import { SetValue } from '@storyblok/field-plugin'
import Button from './button/Button'

type CounterFunc = FunctionComponent<{
  setValue: SetValue
  value: unknown
}>
const Counter: CounterFunc = ({ setValue, value }) => {
  const label = typeof value !== 'number' ? 0 : JSON.stringify(value)
  const handleIncrement = () => {
    setValue((typeof value === 'number' ? value : 0) + 1)
  }

  return (
    <div className="increment">
      <Button onClick={handleIncrement}>Increment {label}</Button>
    </div>
  )
}

export default Counter
