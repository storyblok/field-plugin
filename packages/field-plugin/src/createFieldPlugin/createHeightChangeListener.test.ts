import { createHeightChangeListener } from './createHeightChangeListener'

describe('auto resizer', () => {
  it('observes the document body', () => {
    const onHeightChange = vi.fn()
    const { observe } = mockResizeObserver()
    expect(observe).not.toHaveBeenCalledWith(document.body)
    createHeightChangeListener(onHeightChange)
    expect(observe).toHaveBeenCalledWith(document.body)
  })
  it('disconnects when the cleanup function is called', () => {
    const { mockResize } = mockResizeObserver()
    const onHeightChange = vi.fn()
    const cleanup = createHeightChangeListener(onHeightChange)
    expect(onHeightChange).toHaveBeenCalledTimes(0)
    mockResize()
    expect(onHeightChange).toHaveBeenCalledTimes(1)
    cleanup()
    mockResize()
    expect(onHeightChange).toHaveBeenCalledTimes(1)
  })
  it('post to container the correct number of times', () => {
    const { mockResize } = mockResizeObserver()
    const onHeightChange = vi.fn()
    mockResize()
    expect(onHeightChange).toHaveBeenCalledTimes(0)
    createHeightChangeListener(onHeightChange)
    expect(onHeightChange).toHaveBeenCalledTimes(0)
    mockResize()
    expect(onHeightChange).toHaveBeenCalledTimes(1)
    mockResize()
    expect(onHeightChange).toHaveBeenCalledTimes(2)
  })
  it('calls the callback function', () => {
    const { mockResize } = mockResizeObserver()
    const onHeightChange = vi.fn()
    createHeightChangeListener(onHeightChange)
    mockResize()
    expect(onHeightChange).toHaveBeenCalled()
  })
  it('calls the callback function with the height as argument', () => {
    const { mockResize } = mockResizeObserver()
    const expectedClientHeight = 3816
    vi.spyOn(document.body, 'clientHeight', 'get').mockImplementation(
      () => expectedClientHeight,
    )
    const onHeightChange = vi.fn()
    createHeightChangeListener(onHeightChange)
    mockResize()
    expect(onHeightChange).toHaveBeenCalledWith(expectedClientHeight)
  })
})

const mockResizeObserver = () => {
  const observe = vi.fn()

  let mockEvents: (() => void)[] = []
  const mockResize = () => mockEvents.forEach((it) => it())

  global.ResizeObserver = vi.fn().mockImplementation((onEvent: () => void) => {
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
