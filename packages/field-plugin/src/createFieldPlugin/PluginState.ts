/**
 * Type that describes the complete state of a field type
 */
export type PluginState = {
  // Not included in the messages to plugin
  height: number
  isModalOpen: boolean
  // value
  value: unknown
  // plugin configuration
  options: Record<string, string>
  // Context
  language: string | undefined
  spaceId: number | undefined
  story: unknown
  storyId: number | undefined
  blockId: number | undefined
  token: string | undefined
  uid: string
}
