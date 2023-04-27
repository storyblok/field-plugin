import { hasKey } from './hasKey'

describe('hasKey', () => {
  it('should be false for numbers', () => {
    expect(hasKey(123, 'myKey')).toEqual(false)
  })
  it('should be false for strings', () => {
    expect(hasKey(123, 'string')).toEqual(false)
  })
  it('should be  false for arrays', () => {
    expect(hasKey([1, 2, 3], 'myKey')).toEqual(false)
  })
  it('should be false for undefined', () => {
    expect(hasKey(undefined, 'myKey')).toEqual(false)
  })
  it('should be false for null', () => {
    expect(hasKey(null, 'myKey')).toEqual(false)
  })
  it('should be false for object when key does not exist', () => {
    expect(hasKey({ a: 1 }, 'myKey')).toEqual(false)
  })
  it('should be true for object when key exist', () => {
    expect(hasKey({ myKey: 1 }, 'myKey')).toEqual(true)
  })
  it('should be true for object when key exist with other properties', () => {
    expect(hasKey({ a: 1, myKey: 1 }, 'myKey')).toEqual(true)
  })
})
