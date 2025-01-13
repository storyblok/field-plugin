import type {
  Asset,
  StoryData,
  UserData,
  ModalSize,
  PromptAIPayload,
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
export type PromptAI = (payload: PromptAIPayload) => Promise<string>
export type RequestUserContext = () => Promise<UserData>
export type SelectAsset = () => Promise<Asset>
export type Initialize<Content> = () => Promise<FieldPluginData<Content>>

export type FieldPluginActions<Content> = {
  setContent: SetContent<Content>
  setModalOpen: SetModalOpen<Content>
  requestContext: RequestContext
  promptAI: PromptAI
  requestUserContext: RequestUserContext
  selectAsset: SelectAsset
}
