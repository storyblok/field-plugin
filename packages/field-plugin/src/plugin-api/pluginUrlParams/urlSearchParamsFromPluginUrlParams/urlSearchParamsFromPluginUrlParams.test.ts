import { urlSearchParamsFromPluginUrlParams } from './urlSearchParamsFromPluginUrlParams'
import { PluginUrlParams } from '../PluginUrlParams'

const template: PluginUrlParams = {
  uid: '-preview',
  preview: true,
  host: 'localhost:3000',
  secure: true,
}

describe('serializing PluginUrlParams', () => {
  it('should not start with a question mark', () => {
    expect(urlSearchParamsFromPluginUrlParams(template)).not.toMatch(/^\?/)
  })
  describe('the "protocol" parameter', () => {
    it('should include the protocol', () => {
      expect(urlSearchParamsFromPluginUrlParams(template)).toMatch(`protocol=`)
    })
    it('should include "https:" when secure', () => {
      expect(
        urlSearchParamsFromPluginUrlParams({
          ...template,
          secure: true,
        }),
      ).toMatch(`protocol=${encodeURIComponent('https:')}`)
    })
    it('should include "http:" when not secure', () => {
      expect(
        urlSearchParamsFromPluginUrlParams({
          ...template,
          secure: false,
        }),
      ).toMatch(`protocol=${encodeURIComponent('http:')}`)
    })
    it('should be url encoded', () => {
      expect(urlSearchParamsFromPluginUrlParams(template)).toMatch(
        `host=${encodeURIComponent(template.host)}`,
      )
      expect(urlSearchParamsFromPluginUrlParams(template)).not.toMatch(
        `host=${template.host}`,
      )
    })
  })
  describe('the "host" parameter', () => {
    it('should include the host', () => {
      expect(urlSearchParamsFromPluginUrlParams(template)).toMatch(
        `host=${encodeURIComponent(template.host)}`,
      )
    })
    it('should be url encoded', () => {
      expect(urlSearchParamsFromPluginUrlParams(template)).toMatch(
        `host=${encodeURIComponent(template.host)}`,
      )
      expect(urlSearchParamsFromPluginUrlParams(template)).not.toMatch(
        `host=${template.host}`,
      )
    })
  })
  describe('the "uid" parameter', () => {
    it('should include the uid', () => {
      expect(urlSearchParamsFromPluginUrlParams(template)).toMatch(
        `uid=${encodeURIComponent(template.uid)}`,
      )
    })
    it('should be url encoded', () => {
      const uid = 'abc-123=123&%123'
      const params: PluginUrlParams = {
        ...template,
        uid,
      }
      expect(urlSearchParamsFromPluginUrlParams(params)).toMatch(
        `host=${encodeURIComponent(params.host)}`,
      )
      expect(urlSearchParamsFromPluginUrlParams(template)).not.toMatch(
        `host=${params.host}`,
      )
    })
  })
  describe('the "preview" parameter', () => {
    it('should have value 1 in preview', () => {
      expect(
        urlSearchParamsFromPluginUrlParams({
          ...template,
          preview: true,
        }),
      ).toMatch(`preview=1`)
    })
    it('should be omitted in non-preview', () => {
      expect(
        urlSearchParamsFromPluginUrlParams({
          ...template,
          preview: false,
        }),
      ).not.toMatch(`preview=`)
    })
  })
})
