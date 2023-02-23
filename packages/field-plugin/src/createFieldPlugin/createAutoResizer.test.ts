/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable functional/no-this-expression */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable functional/no-let */

import { createAutoResizer } from './createAutoResizer'
import { isHeightChangeMessage } from '../messaging'

const uid = '093w2jfido'

describe('auto resizer', () => {
  it('observes the document body', () => {
    const postToContainer = jest.fn()
    const { observe } = mockResizeObserver()
    expect(observe).not.toHaveBeenCalledWith(document.body)
    createAutoResizer(uid, postToContainer)
    expect(observe).toHaveBeenCalledWith(document.body)
  })
  it('disconnects when the cleanup function is called', () => {
    const { mockResize } = mockResizeObserver()
    const postToContainer = jest.fn()
    const cleanup = createAutoResizer(uid, postToContainer)
    expect(postToContainer).toHaveBeenCalledTimes(0)
    mockResize()
    expect(postToContainer).toHaveBeenCalledTimes(1)
    cleanup()
    mockResize()
    expect(postToContainer).toHaveBeenCalledTimes(1)
  })
  it('post to container the correct number of times', () => {
    const { mockResize } = mockResizeObserver()
    const postToContainer = jest.fn()
    mockResize()
    expect(postToContainer).toHaveBeenCalledTimes(0)
    createAutoResizer(uid, postToContainer)
    expect(postToContainer).toHaveBeenCalledTimes(0)
    mockResize()
    expect(postToContainer).toHaveBeenCalledTimes(1)
    mockResize()
    expect(postToContainer).toHaveBeenCalledTimes(2)
  })
  it('posts a HeightChangeMessage to the container', () => {
    const { mockResize } = mockResizeObserver()
    let message: undefined | unknown
    const postToContainer = jest.fn((m) => {
      message = m
    })
    createAutoResizer(uid, postToContainer)
    mockResize()
    expect(isHeightChangeMessage(message)).toBeTruthy()
  })
  it('posts the right height to the container', () => {
    const { mockResize } = mockResizeObserver()
    let message = undefined as unknown
    const postToContainer = jest.fn((m) => {
      message = m
    })

    const expectedClientHeight = 3816
    jest
      .spyOn(document.body, 'clientHeight', 'get')
      .mockImplementation(() => expectedClientHeight)
    createAutoResizer(uid, postToContainer)
    mockResize()
    if (!isHeightChangeMessage(message)) {
      fail('The message is not a height change message')
    }
    expect(message.height).toEqual(expectedClientHeight)
  })
})

const mockResizeObserver = () => {
  const observe = jest.fn()

  // eslint-disable-next-line functional/no-let
  let mockEvents: (() => void)[] = []
  const mockResize = () => mockEvents.forEach((it) => it())

  global.ResizeObserver = jest
    .fn()
    .mockImplementation((onEvent: () => void) => {
      mockEvents = [...mockEvents, onEvent]
      const disconnect = () => {
        mockEvents = mockEvents.filter((it) => it !== onEvent)
      }
      return {
        observe,
        disconnect,
      }
    })

  return {
    observe,
    mockResize,
  }
}
