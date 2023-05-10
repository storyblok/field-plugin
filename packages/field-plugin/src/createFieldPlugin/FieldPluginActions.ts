import { Asset } from '../messaging'

export type SetContent = (content: unknown) => void
export type SetModalOpen = (isModal: boolean) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
