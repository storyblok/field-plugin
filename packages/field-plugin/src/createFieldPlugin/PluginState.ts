/**
 * Type that describes the complete state of a field type
 */
export type PluginState = {
  height: number
  isModalOpen: boolean
  value: unknown
  options: Record<string, string>
  // If no language is available, for example via the field plugin editor, the language will be an empty string `""`
  language: string | undefined
  spaceId: number | undefined
  story: unknown
  storyId: number | undefined
  blockUid: string | undefined
  token: string | undefined
  uid: string
}
