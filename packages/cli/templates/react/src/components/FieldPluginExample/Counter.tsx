import { FunctionComponent } from 'react'

const Counter: FunctionComponent<{
  count: number
  onIncrease: () => void
}> = ({ count, onIncrease }) => {
  return (
    <div>
      <h2>Field Value</h2>
      <div
        className="counter-value"
        data-testid="count"
      >
        {count}
      </div>
      <button
        className="btn w-full"
        onClick={onIncrease}
      >
        Increment
      </button>
    </div>
  )
}

export default Counter
