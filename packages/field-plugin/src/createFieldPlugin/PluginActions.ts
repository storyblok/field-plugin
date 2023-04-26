import { Asset } from '../messaging'

export type SetHeight = (heightPx: number) => void
export type SetValue = (value: unknown) => void
export type SetModalOpen = (isModal: boolean) => void
export type SetPluginReady = () => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<Asset>

export type PluginActions = {
  setHeight: SetHeight
  setValue: SetValue
  setModalOpen: SetModalOpen
  setPluginReady: SetPluginReady
  requestContext: RequestContext
  selectAsset: SelectAsset
}
