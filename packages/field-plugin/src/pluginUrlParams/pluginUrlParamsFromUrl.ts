import { PluginUrlParams } from '../plugin-api'

export const pluginUrlParamsFromUrl = (
  url: string,
): PluginUrlParams | undefined => {
  const searchParams = new URLSearchParams(url)

  const uid = searchParams.get('uid') ?? undefined
  const protocol = searchParams.get('protocol') ?? undefined
  const host = searchParams.get('host') ?? undefined
  const preview = searchParams.get('preview') ?? undefined

  return typeof uid !== 'undefined' &&
    typeof protocol !== 'undefined' &&
    typeof host !== 'undefined'
    ? {
        uid,
        protocol,
        host,
        preview: typeof preview !== 'undefined',
      }
    : undefined
}
