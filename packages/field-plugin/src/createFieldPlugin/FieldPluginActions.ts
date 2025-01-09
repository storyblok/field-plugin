import type { Asset, StoryData, UserData, ModalSize } from '../messaging'
import type { FieldPluginData } from './FieldPluginData'

export type SetContent<Content> = (
  content: Content,
) => Promise<FieldPluginData<Content>>
export type SetModalOpen<Content> = (
  isModalOpen: boolean,
  modalSize?: ModalSize,
) => Promise<FieldPluginData<Content>>
export type RequestContext = () => Promise<StoryData>
export type RequestUserContext = () => Promise<UserData>
export type SelectAsset = () => Promise<Asset>
export type Initialize<Content> = () => Promise<FieldPluginData<Content>>

export type FieldPluginActions<Content> = {
  setContent: SetContent<Content>
  setModalOpen: SetModalOpen<Content>
  requestContext: RequestContext
  requestUserContext: RequestUserContext
  selectAsset: SelectAsset
}
