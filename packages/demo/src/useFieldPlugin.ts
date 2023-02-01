import {
  createFieldPlugin,
  PluginActions,
  PluginState,
} from '@storyblok/field-plugin'
import { useEffect, useState } from 'react'

type UseFieldPlugin = () =>
  | [PluginState, PluginActions]
  | [undefined, undefined]

export const useFieldPlugin: UseFieldPlugin = () => {
  const [state, setState] = useState<PluginState | undefined>(undefined)
  const [actions, setActions] = useState<PluginActions | undefined>(undefined)

  useEffect(() => {
    const [actions, cleanupSideEffects] = createFieldPlugin(setState)
    setActions(actions)
    return cleanupSideEffects
  }, [])

  return state && actions ? [state, actions] : [undefined, undefined]
}
