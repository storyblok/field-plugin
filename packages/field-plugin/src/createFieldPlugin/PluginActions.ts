export type SetHeight = (heightPx: number) => void
export type SetValue = (value: unknown) => void
export type SetModalOpen = (isModal: boolean) => void
export type SetPluginReady = () => void
export type RequestContext = () => void
export type SelectAsset = () => Promise<string>

export type PluginActions = {
  setHeight: SetHeight
  setValue: SetValue
  setModalOpen: SetModalOpen
  setPluginReady: SetPluginReady
  requestContext: RequestContext
  selectAsset: SelectAsset
}
