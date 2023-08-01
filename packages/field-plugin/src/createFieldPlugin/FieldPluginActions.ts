import { Asset } from '../messaging'

export type SetStateAction<T> = T | ((value: T) => T)
export type SetContent<Content> = (
  setContentAction: SetStateAction<Content>,
) => void
export type SetModalOpen = (setModalOpenAction: SetStateAction<boolean>) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions<Content = unknown> = {
  setContent: SetContent<Content>
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
