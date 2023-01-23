import { PluginUrlParams } from '../PluginUrlParams'

/**
 * Constructs a ULR search params string from a PluginUrlParams object, without a leading question mark.
 * @param pluginUrlParams
 */
export const urlSearchParamsFromPluginUrlParams = (
  pluginUrlParams: PluginUrlParams,
): string => {
  const searchParams = new URLSearchParams({
    protocol: pluginUrlParams.secure ? 'https:' : 'http:',
    host: pluginUrlParams.host,
    uid: pluginUrlParams.uid,
  })
  if (pluginUrlParams.preview) {
    searchParams.set('preview', '1')
  }
  return searchParams.toString()
}
