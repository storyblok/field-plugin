import { Asset } from '../messaging'

export type SetHeight = (heightPx: number) => void
export type SetValue = (value: unknown) => void
export type SetModalOpen = (isModal: boolean) => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type FieldPluginActions = {
  setHeight: SetHeight
  setValue: SetValue
  setModalOpen: SetModalOpen
  requestContext: RequestContext
  selectAsset: SelectAsset
}
