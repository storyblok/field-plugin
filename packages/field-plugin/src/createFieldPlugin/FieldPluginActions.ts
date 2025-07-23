import type {
  Asset,
  StoryData,
  UserData,
  ModalSize,
  PromptAIPayload,
  PromptAIResponse,
  Dimension,
} from '../messaging'
import type { FieldPluginData } from './FieldPluginData'

export type SetContent<Content> = (
  content: Content,
) => Promise<FieldPluginData<Content>>
export type SetModalOpen<Content> = (
  isModalOpen: boolean,
  modalSize?: ModalSize,
) => Promise<FieldPluginData<Content>>
export type RequestContext = () => Promise<StoryData>
export type PromptAI = (payload: PromptAIPayload) => Promise<PromptAIResponse>
export type RequestUserContext = () => Promise<UserData>
export type SelectAsset = () => Promise<Asset>
export type Initialize<Content> = () => Promise<FieldPluginData<Content>>
export type SetPreviewWidth = (previewWidth: Dimension) => Promise<void>

export type FieldPluginActions<Content> = {
  setContent: SetContent<Content>
  setModalOpen: SetModalOpen<Content>
  requestContext: RequestContext
  promptAI: PromptAI
  requestUserContext: RequestUserContext
  selectAsset: SelectAsset
  setPreviewDimension: SetPreviewWidth
}
