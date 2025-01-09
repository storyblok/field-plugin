/**
 * Type that describes the complete state of a field type
 */
import { StoryData } from '../messaging'

export type FieldPluginData<Content> = {
  isModalOpen: boolean
  content: Content
  options: Record<string, string>
  spaceId: number | undefined
  userId: number | undefined
  interfaceLang: string
  storyLang: string
  story: StoryData
  storyId: number | undefined
  blockUid: string | undefined
  token: string | undefined
  uid: string
  translatable: boolean
  isAIEnabled: boolean
  releases: Release[]
  releaseId: number | undefined
}

export type Release = {
  name: string
  id: number
  created_at: string
  release_at: string
  released: boolean
  uuid: string
  branches_to_deploy: number[]
  timezone: string
  description?: string
}
