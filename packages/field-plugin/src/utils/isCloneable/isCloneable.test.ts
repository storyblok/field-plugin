import 'core-js/stable/structured-clone'
import { isCloneable } from './isCloneable'

describe('isCloneable', () => {
  it('should be true to objects', () => {
    expect(isCloneable({})).toEqual(true)
  })

  it('should be true to arrays', () => {
    expect(isCloneable([])).toEqual(true)
  })

  it('should be true to strings', () => {
    expect(isCloneable('hello')).toEqual(true)
  })

  it('should be true to integer', () => {
    expect(isCloneable(0)).toEqual(true)
  })

  it('should be true to null', () => {
    expect(isCloneable(null)).toEqual(true)
  })

  it('should be true to undefined', () => {
    expect(isCloneable(undefined)).toEqual(true)
  })

  it('should be true to Date', () => {
    expect(isCloneable(new Date())).toEqual(true)
  })

  it('should be true to Map', () => {
    expect(isCloneable(new Map())).toEqual(true)
  })

  it('should be true to Set', () => {
    expect(isCloneable(new Set())).toEqual(true)
  })

  it('should be false to function', () => {
    expect(isCloneable(() => '')).toEqual(false)
  })

  it('should be false to Symbol', () => {
    expect(isCloneable(Symbol())).toEqual(false)
  })
})
