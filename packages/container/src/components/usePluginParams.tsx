import { useMemo } from 'react'
import { PluginUrlParams } from '@storyblok/field-plugin'

export const usePluginParams = () => {
  return useMemo<PluginUrlParams>(
    () => ({
      uid: Math.random().toString(32).slice(2),
      host: window.location.host,
      secure: window.location.protocol === 'https:',
      preview: true,
    }),
    [],
  )
}
