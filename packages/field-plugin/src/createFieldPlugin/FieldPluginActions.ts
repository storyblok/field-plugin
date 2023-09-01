import { Asset, StoryData } from '../messaging'
import { FieldPluginData } from './FieldPluginData'

export type SetContent = <C>(content: C) => Promise<FieldPluginData>
export type SetModalOpen = (isModalOpen: boolean) => Promise<FieldPluginData>
export type RequestContext = () => Promise<StoryData>
export type SelectAsset = () => Promise<Asset>
export type SetLoaded = () => Promise<FieldPluginData>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
