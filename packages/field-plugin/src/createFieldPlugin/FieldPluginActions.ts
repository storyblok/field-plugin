import { Asset, StoryData } from '../messaging'
import { FieldPluginData } from './FieldPluginData'

export type SetContent = <C>(setContentAction: C) => Promise<FieldPluginData>
export type SetModalOpen = (
  setModalOpenAction: boolean,
) => Promise<FieldPluginData>
export type RequestContext = () => Promise<StoryData>
export type SelectAsset = () => Promise<Asset>
export type SetLoaded = () => Promise<FieldPluginData>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
  setLoaded: SetLoaded
}
