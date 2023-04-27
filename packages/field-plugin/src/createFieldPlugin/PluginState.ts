/**
 * Type that describes the complete state of a field type
 */
import { StoryData } from '../messaging'

export type PluginState = {
  height: number
  isModalOpen: boolean
  value: unknown
  options: Record<string, string>
  spaceId: number | undefined
  story: StoryData
  storyId: number | undefined
  blockUid: string | undefined
  token: string | undefined
  uid: string
}
