import { originFromPluginParams } from './originFromPluginParams'

describe('originFromPluginParams', () => {
  it('uses HTTPS for secure params', () => {
    expect(
      originFromPluginParams({
        secure: true,
        host: 'localhost:8080',
        uid: '-preview',
        preview: false,
      }),
    ).toBe('https://localhost:8080')
  })
  it('uses HTTP for insecure params', () => {
    expect(
      originFromPluginParams({
        secure: false,
        host: 'localhost:8080',
        uid: '-preview',
        preview: false,
      }),
    ).toBe('http://localhost:8080')
  })
  it('appends the host to the protocol', () => {
    expect(
      originFromPluginParams({
        secure: true,
        host: 'plugin.storyblok.com',
        uid: '-preview',
        preview: false,
      }),
    ).toBe('https://plugin.storyblok.com')
  })
})
