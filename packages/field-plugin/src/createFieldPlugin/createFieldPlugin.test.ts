import { createFieldPlugin } from './createFieldPlugin'
import { sandboxUrl } from './sandboxUrl'

describe('createFieldPlugin', () => {
  it('should send an error message to the container saying it is not embedded', () => {
    const onUpdateStateMock = jest.fn()

    const cleanupFieldPlugin = createFieldPlugin(onUpdateStateMock)

    expect(onUpdateStateMock).toBeCalled()
    expect(onUpdateStateMock).toHaveBeenCalledWith({
      type: 'error',
      error: new Error(
        `The window is not embedded within another window. Did you mean to open the field plugin in the sandbox? ${sandboxUrl()}`,
      ),
    })
    expect(cleanupFieldPlugin()).toEqual(undefined)
  })

  it('should have invalid params', () => {
    const originalWindow = { ...window }

    const windowSpy = jest.spyOn(global, 'window', 'get')

    windowSpy.mockImplementation(() => ({
      ...originalWindow,
    }))

    const onUpdateStateMock = jest.fn()

    const cleanupFieldPlugin = createFieldPlugin(onUpdateStateMock)

    expect(onUpdateStateMock).toBeCalled()
    expect(onUpdateStateMock).toHaveBeenCalledWith({
      type: 'error',
      error: new Error(
        `The URL parameters does not match the expected format.`,
      ),
    })
    expect(cleanupFieldPlugin()).toEqual(undefined)

    windowSpy.mockRestore()
  })
})
