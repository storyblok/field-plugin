import { callbackQueue } from './callbackQueue'

describe('callbackQueue', () => {
  it('pops the callback function', () => {
    const { pushCallback, popCallback } = callbackQueue()
    const id1 = pushCallback('asset', () => 1)
    expect(popCallback('asset', id1)).toBeDefined()
    expect(popCallback('asset', id1)).toBeUndefined()
  })
  describe('pop', () => {
    it('returns the correct reference when multiple callbacks are stored', () => {
      const { pushCallback, popCallback } = callbackQueue()
      const _id1 = pushCallback('asset', () => 1)
      const id2 = pushCallback('asset', () => 1)
      const _id3 = pushCallback('asset', () => 1)
      expect(popCallback('asset', id2)).toBeDefined()
    })
    it('return the correct reference', () => {
      const { pushCallback, popCallback } = callbackQueue()
      const callback1 = () => 1
      const callback2 = () => 1
      const callback3 = () => 1
      const id1 = pushCallback('asset', callback1)
      const id2 = pushCallback('asset', callback2)
      const id3 = pushCallback('asset', callback3)
      expect(popCallback('asset', id2)).toBe(callback2)
      expect(popCallback('asset', id1)).toBe(callback1)
      expect(popCallback('asset', id3)).toBe(callback3)
    })
  })
})
