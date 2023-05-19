import { Asset } from '../messaging'

export type DispatchAction<T> = T | ((value: T) => T)
export type SetContent = <C>(setContentAction: DispatchAction<C>) => void
export type SetModalOpen = (setModalOpenAction: DispatchAction<boolean>) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
