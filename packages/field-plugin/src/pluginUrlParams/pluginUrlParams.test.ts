import { pluginUrlParamsFromUrl } from './pluginUrlParamsFromUrl'

const template = {
  uid: '123',
  protocol: 'http:',
  host: 'localhost:1234',
  preview: '1',
}

describe('fieldTypeSearchParams', () => {
  it('parses', () => {
    expect(
      pluginUrlParamsFromUrl(
        '?protocol=http:&host=localhost:1234&uid=abc123&preview=1',
      ),
    ).not.toBeUndefined()
  })
  test('that the leading questionmark is optional', () => {
    expect(
      pluginUrlParamsFromUrl(
        'protocol=http:&host=localhost:1234&uid=abc123&preview=1',
      ),
    ).not.toBeUndefined()
  })
  it('requires protocol', () => {
    expect(
      pluginUrlParamsFromUrl('?host=localhost:1234&uid=abc123&preview=1'),
    ).toBeUndefined()
  })
  it('requires host', () => {
    expect(
      pluginUrlParamsFromUrl('?protocol=http:&uid=abc123&preview=1'),
    ).toBeUndefined()
  })
  it('requires uid', () => {
    expect(
      pluginUrlParamsFromUrl('?protocol=http:&host=localhost:1234&preview=1'),
    ).toBeUndefined()
  })
  test('that preview is optional', () => {
    expect(
      pluginUrlParamsFromUrl('?protocol=http:&host=localhost:1234&uid=abc123'),
    ).not.toBeUndefined()
  })
})
