import { Asset } from '../messaging'

type DispatchAction<T> = T | ((value: T) => T)
export type SetContent = <Content = undefined>(
  setContentAction: DispatchAction<Content>,
) => void
export type SetModalOpen = (setModalOpenAction: DispatchAction<boolean>) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
