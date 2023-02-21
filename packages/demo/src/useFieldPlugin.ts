import { createFieldPlugin, PluginResult } from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

type UseFieldPlugin = () => PluginResult

export const useFieldPlugin: UseFieldPlugin = () => {
  const [state, setState] = useState<PluginResult>(() => ({
    isLoading: true,
  }))

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  return state
}
