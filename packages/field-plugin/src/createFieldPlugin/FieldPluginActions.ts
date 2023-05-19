import { Asset } from '../messaging'

export type SetContent = <Content = undefined>(
  setContentAction: Content | ((content: Content) => void),
) => void
export type SetModalOpen = (isModal: boolean) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
