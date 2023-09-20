import { Asset, StoryData } from '../messaging'
import { FieldPluginData } from './FieldPluginData'

export type SetContent<Content> = (
  content: Content,
) => Promise<FieldPluginData<Content>>
export type SetModalOpen<Content> = (
  isModalOpen: boolean,
) => Promise<FieldPluginData<Content>>
export type RequestContext = () => Promise<StoryData>
export type SelectAsset = () => Promise<Asset>
export type Initialize<Content> = () => Promise<FieldPluginData<Content>>

export type FieldPluginActions<Content> = {
  setContent: SetContent<Content>
  setModalOpen: SetModalOpen<Content>
  requestContext: RequestContext
  selectAsset: SelectAsset
}
