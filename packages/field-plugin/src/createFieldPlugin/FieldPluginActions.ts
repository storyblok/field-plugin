import { Asset } from '../messaging'

export type SetStateAction<T> = T | ((value: T) => T)
export type SetContent = <C>(setContentAction: SetStateAction<C>) => void
export type SetModalOpen = (setModalOpenAction: SetStateAction<boolean>) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setContent: SetContent
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
