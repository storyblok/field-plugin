/**
 * Type that describes the complete state of a field type
 */
import { StoryData } from '../messaging'

export type FieldPluginData = {
  isModalOpen: boolean
  content: unknown
  options: Record<string, string>
  spaceId: number | undefined
  storyLang: string
  story: StoryData
  storyId: number | undefined
  blockUid: string | undefined
  token: string | undefined
  uid: string
}
