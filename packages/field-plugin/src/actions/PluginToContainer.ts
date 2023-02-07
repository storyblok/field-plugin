export type SetHeight = (heightPx: number) => void
export type SetValue = (value: unknown) => void
export type SetModalOpen = (isModal: boolean) => void
export type SetPluginReady = () => void
export type RequestContext = () => void
export type SetAssetModalOpen = (field: string) => void

export type PluginActions = {
  setHeight: SetHeight
  setValue: SetValue
  setModalOpen: SetModalOpen
  setPluginReady: SetPluginReady
  requestContext: RequestContext
  setAssetModalOpen: SetAssetModalOpen
}
