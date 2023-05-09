/**
 * Type that describes the complete state of a field type
 */
import { StoryData } from '../messaging'

export type FieldPluginData = {
  height: number
  isModalOpen: boolean
  content: unknown
  options: Record<string, string>
  spaceId: number | undefined
  story: StoryData
  storyId: number | undefined
  blockUid: string | undefined
  token: string | undefined
  uid: string
}
