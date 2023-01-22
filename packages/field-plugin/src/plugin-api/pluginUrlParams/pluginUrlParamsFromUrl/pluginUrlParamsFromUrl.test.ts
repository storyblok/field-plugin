import { pluginUrlParamsFromUrl } from './pluginUrlParamsFromUrl'

describe('deserializing PluginUrlParams', () => {
  test('that the leading question mark in argument string is optional', () => {
    expect(
      pluginUrlParamsFromUrl(
        'protocol=http:&host=localhost:1234&uid=abc123&preview=1',
      ),
    ).not.toBeUndefined()
  })
  it('allows all parameters to be present', () => {
    expect(
      pluginUrlParamsFromUrl(
        '?protocol=http:&host=localhost:1234&uid=abc123&preview=1',
      ),
    ).not.toBeUndefined()
  })
  describe('the "protocol" parameter', () => {
    it('requires protocol', () => {
      expect(
        pluginUrlParamsFromUrl('?host=localhost:1234&uid=abc123&preview=1'),
      ).toBeUndefined()
    })
    it('the protocol can be "http:"', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).not.toBeUndefined()
    })
    it('the protocol can be "https:"', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=https:&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).not.toBeUndefined()
    })
    it('the protocol needs to include colons after "http" or "https"', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).toBeUndefined()
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=https&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).toBeUndefined()
    })
    it('the protocol can only be "http:" or "https:"', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=ftp:&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).toBeUndefined()
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=ftps:&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).toBeUndefined()
    })
  })
  describe('the "host" parameter', () => {
    it('requires host', () => {
      expect(
        pluginUrlParamsFromUrl('?protocol=http:&uid=abc123&preview=1'),
      ).toBeUndefined()
    })
    it('allows localhost with port', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).toHaveProperty('host', 'localhost:1234')
    })
    it('allows localhost without port', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=localhost&uid=abc123&preview=1',
        ),
      ).toHaveProperty('host', 'localhost')
    })
    it('allows a web domain', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=plugin.storyblok.com&uid=abc123&preview=1',
        ),
      ).toHaveProperty('host', 'plugin.storyblok.com')
    })
    it('allows an ip address', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=127.0.0.1 &uid=abc123&preview=1',
        ),
      ).toHaveProperty('host', '127.0.0.1 ')
    })
  })
  describe('the "uid" parameter', () => {
    it('requires uid', () => {
      expect(
        pluginUrlParamsFromUrl('?protocol=http:&host=localhost:1234&preview=1'),
      ).toBeUndefined()
    })
  })
  describe('the "preview" parameter', () => {
    test('that preview is optional', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=localhost:1234&uid=abc123',
        ),
      ).not.toBeUndefined()
    })
    test('that preview is enabled if the parameter is present', () => {
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=localhost:1234&uid=abc123&preview=1',
        ),
      ).toHaveProperty('preview', true)
      expect(
        pluginUrlParamsFromUrl(
          '?protocol=http:&host=localhost:1234&uid=abc123',
        ),
      ).toHaveProperty('preview', false)
    })
  })
})
