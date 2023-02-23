/**
 * Type that describes the complete state of a field type
 */
import { StoryData } from '../messaging'

export type PluginState = {
  // Not included in the messages to plugin
  height: number
  isModalOpen: boolean
  // value
  value: unknown
  // plugin configuration
  options: Record<string, string>
  // Context
  language: string | undefined
  spaceId: number | undefined
  story: StoryData
  storyId: number | undefined
  // TODO: when using in state, call it _uid instead
  blockId: number | undefined
  token: string | undefined
  uid: string
}
