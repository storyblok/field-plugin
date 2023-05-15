import { useCallback, useMemo, useState } from 'react'
import { PluginUrlParams } from '@storyblok/field-plugin'

const randomString = () => Math.random().toString(32).slice(2)

export const usePluginParams = () => {
  const [uid, setUid] = useState(randomString)
  const randomizeUid = useCallback(() => setUid(randomString), [])
  const pluginParams = useMemo<PluginUrlParams>(
    () => ({
      uid,
      host: window.location.host,
      secure: window.location.protocol === 'https:',
      preview: true,
    }),
    [uid],
  )
  return {
    pluginParams,
    randomizeUid,
  }
}
