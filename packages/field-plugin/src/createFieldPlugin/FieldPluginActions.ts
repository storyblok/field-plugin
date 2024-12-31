import type { FieldPluginData } from './FieldPluginData'
import type { Asset, PromptAIPayload, StoryData } from '../messaging'

export type SetContent<Content> = (
  content: Content,
) => Promise<FieldPluginData<Content>>
export type SetModalOpen<Content> = (
  isModalOpen: boolean,
) => Promise<FieldPluginData<Content>>
export type RequestContext = () => Promise<StoryData>
export type PromptAI = (payload: PromptAIPayload) => Promise<string>
export type SelectAsset = () => Promise<Asset>
export type Initialize<Content> = () => Promise<FieldPluginData<Content>>

export type FieldPluginActions<Content> = {
  setContent: SetContent<Content>
  setModalOpen: SetModalOpen<Content>
  requestContext: RequestContext
  promptAI: PromptAI
  selectAsset: SelectAsset
}
