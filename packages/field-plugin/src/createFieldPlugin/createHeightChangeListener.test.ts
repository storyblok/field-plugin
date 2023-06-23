/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable functional/no-this-expression */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable functional/no-let */

import { createHeightChangeListener } from './createHeightChangeListener'
import { HeightChangeMessage, isHeightChangeMessage } from '../messaging'

const uid = '093w2jfido'

describe('auto resizer', () => {
  it('observes the document body', () => {
    const postToContainer = jest.fn()
    const { observe } = mockResizeObserver()
    expect(observe).not.toHaveBeenCalledWith(document.body)
    createHeightChangeListener(uid, postToContainer, () => true)
    expect(observe).toHaveBeenCalledWith(document.body)
  })
  it('disconnects when the cleanup function is called', () => {
    const { mockResize } = mockResizeObserver()
    const postToContainer = jest.fn()
    const cleanup = createHeightChangeListener(uid, postToContainer, () => true)
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
    createHeightChangeListener(uid, postToContainer, () => true)
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
    createHeightChangeListener(uid, postToContainer, () => true)
    mockResize()
    expect(isHeightChangeMessage(message)).toEqual(true)
  })
  it('posts the height as a string to the container', () => {
    const { mockResize } = mockResizeObserver()
    const postToContainer = jest.fn()

    const expectedClientHeight = 3816
    jest
      .spyOn(document.body, 'clientHeight', 'get')
      .mockImplementation(() => expectedClientHeight)
    createHeightChangeListener(uid, postToContainer, () => true)
    mockResize()
    expect(postToContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        height: `${expectedClientHeight}px`,
      } satisfies Partial<HeightChangeMessage>),
    )
  })
  describe('disabled/enabled state', () => {
    it('does post a messages in an enabled state', () => {
      const { mockResize } = mockResizeObserver()
      const postToContainer = jest.fn()
      createHeightChangeListener(uid, postToContainer, () => true)
      mockResize()
      expect(postToContainer).toHaveBeenCalled()
    })
    it('does not post any messages in a disabled state', () => {
      const { mockResize } = mockResizeObserver()
      const postToContainer = jest.fn()
      createHeightChangeListener(uid, postToContainer, () => false)
      mockResize()
      expect(postToContainer).not.toHaveBeenCalled()
    })
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
