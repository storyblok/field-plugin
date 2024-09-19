import { existsSync, readFileSync } from 'fs'
import { vi } from 'vitest'
import { load } from '../manifest'

vi.mock('fs')

describe('manifest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return undefined in case no file is found', () => {
    vi.mocked(existsSync).mockReturnValue(false)

    expect(load()).toBe(undefined)
  })

  it('should raises an exception in case of empty file', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue('')

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: Unexpected end of JSON input]`,
    )
  })

  it('should raises an exception when a not allowed property is found', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        notAllowedProperty: [],
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: The property notAllowedProperty is not allowed]`,
    )
  })

  it('should raise an exception when `options` is not an array', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: '',
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: When declared, the 'options' property should be an array]`,
    )
  })

  it('should raise an exception when `options` is not an array', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: {},
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: When declared, the 'options' property should be an array]`,
    )
  })

  it('should NOT raise an exception when `options` is an empty array', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: [],
      }),
    )

    expect(() => load()).not.toThrowError()
  })

  it('should NOT raise an exception when `options` is an undefined', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: undefined,
      }),
    )

    expect(() => load()).not.toThrowError()
  })

  it('should raise an exception when `options` is not an array', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: null,
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: When declared, the 'options' property should be an array]`,
    )
  })

  it('should raise an exception when any `options item` has no `name` property', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: [
          {
            name: 'opt1',
            value: 'val1',
          },
          { value: '' },
        ],
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: Each option must be an object with string properties "name" and "value". The following values need to be corrected: \n {"value":""} --> Incorrect object value. Must be of type {"name": string, "value": string}.]`,
    )
  })

  it('should raise an exception when any `options item` has no `value` property', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: [
          {
            name: 'opt1',
            value: 'val1',
          },
          { name: '' },
        ],
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: Each option must be an object with string properties "name" and "value". The following values need to be corrected: \n {"name":""} --> Incorrect object value. Must be of type {"name": string, "value": string}.]`,
    )
  })

  it('should raise an exception when any `options item` --> `value` property is not of type string', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: [
          {
            name: 'opt1',
            value: 1,
          },
        ],
      }),
    )

    expect(() => load()).toThrowErrorMatchingInlineSnapshot(
      `[Error: Error while loading the manifest file: Each option must be an object with string properties "name" and "value". The following values need to be corrected: \n {"name":"opt1","value":1} --> Incorrect value type. Must be of type string.]`,
    )
  })

  it('should be valid but with no `options` defined', () => {
    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue('{}')

    const manifest = load()

    expect(manifest).toBeInstanceOf(Object)
    expect(manifest?.options).toBe(undefined)
  })

  it('should be valid and contain the defined option', () => {
    const option = {
      name: 'opt1',
      value: 'val1',
    }

    vi.mocked(existsSync).mockReturnValue(true)
    vi.mocked(readFileSync).mockReturnValue(
      JSON.stringify({
        options: [option],
      }),
    )

    const manifest = load()

    expect(manifest?.options?.length).toBe(1)
    expect(manifest?.options).toContainEqual(option)
  })
})
