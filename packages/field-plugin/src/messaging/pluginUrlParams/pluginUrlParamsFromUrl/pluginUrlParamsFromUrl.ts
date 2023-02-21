import { PluginUrlParams } from '../PluginUrlParams'

export const pluginUrlParamsFromUrl = (
  url: string,
): PluginUrlParams | undefined => {
  const searchParams = new URLSearchParams(url)

  const uid = searchParams.get('uid') ?? undefined
  const protocol = searchParams.get('protocol') ?? undefined
  const host = searchParams.get('host') ?? undefined
  const preview = searchParams.get('preview') ?? undefined

  if (protocol !== 'http:' && protocol !== 'https:') {
    return undefined
  }

  if (typeof uid === 'undefined' || typeof host === 'undefined') {
    return undefined
  }

  const secure = protocol === 'https:'

  return {
    uid,
    secure,
    host,
    preview: typeof preview !== 'undefined',
  }
}
