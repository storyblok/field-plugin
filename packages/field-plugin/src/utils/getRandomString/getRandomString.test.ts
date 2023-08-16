import { getRandomString } from './getRandomString'

describe('getRandomString', () => {
  it('should generate string of correct length', () => {
    expect(getRandomString(10)).toHaveLength(10)
  })
  it('should not generate the same string twice', () => {
    const strA = getRandomString(16)
    const strB = getRandomString(16)
    expect(strA).not.toEqual(strB)
  })
})
