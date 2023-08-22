import { Asset } from '../messaging'

export type SetContent = <C>(content: C) => void
export type SetModalOpen = (isModalOpen: boolean) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
