import { createKeydownEscListener } from './createKeydownEscListener'
import { MockInstance } from 'vitest'

describe('createKeydownEscListener', () => {
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance
  const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call addEventListener with keydown and handleEsc', () => {
    const mockOnPressed = vi.fn()

    createKeydownEscListener(mockOnPressed)

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    )
  })

  it('should trigger onPressed when Escape key is pressed', () => {
    const mockOnPressed = vi.fn()

    const removeListener = createKeydownEscListener(mockOnPressed)

    document.dispatchEvent(escapeEvent)

    expect(mockOnPressed).toHaveBeenCalled()

    removeListener()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    )
  })

  it('should not trigger onPressed when a non-Escape key is pressed', () => {
    const mockOnPressed = vi.fn()

    createKeydownEscListener(mockOnPressed)

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(enterEvent)

    expect(mockOnPressed).not.toHaveBeenCalled()
  })

  it('should not trigger onPressed when the cleanup function is called', () => {
    const mockOnPressed = vi.fn()
    const removeListener = createKeydownEscListener(mockOnPressed)

    removeListener()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    )

    document.dispatchEvent(escapeEvent)

    expect(mockOnPressed).not.toHaveBeenCalled()
  })
})
