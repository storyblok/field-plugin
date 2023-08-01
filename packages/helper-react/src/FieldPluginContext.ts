import { FieldPluginResponse } from '@storyblok/field-plugin'
import { createContext } from 'react'

export const FieldPluginContext = createContext<
  Extract<FieldPluginResponse, { type: 'loaded' }> | undefined
>(undefined)
