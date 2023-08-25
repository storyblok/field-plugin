import { callbackQueue } from './callbackQueue'

describe('callbackQueue', () => {
  it('respects the maxQueueLength argument', () => {
    const { pushCallback, popCallback } = callbackQueue(2)
    const id1 = pushCallback('asset', () => 1)
    const id2 = pushCallback('asset', () => 2)
    const id3 = pushCallback('asset', () => 3)
    expect(popCallback('asset', id1)).toBeUndefined()
    expect(popCallback('asset', id2)).toBeDefined()
    expect(popCallback('asset', id3)).toBeDefined()
  })
})
