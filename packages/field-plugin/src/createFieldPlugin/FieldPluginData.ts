/**
 * Type that describes the complete state of a field type
 */
import { StoryData } from '../messaging'

export type FieldPluginData<Content = unknown> = {
  isModalOpen: boolean
  content: Content
  options: Record<string, string>
  spaceId: number | undefined
  storyLang: string
  story: StoryData
  storyId: number | undefined
  blockUid: string | undefined
  token: string | undefined
  uid: string
}
