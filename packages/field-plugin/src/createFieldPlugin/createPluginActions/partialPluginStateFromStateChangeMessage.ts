import { FieldPluginData } from '../FieldPluginData'
import {
  LoadedMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
} from '../../messaging'

export const pluginStateFromStateChangeMessage = <Content>(
  message: LoadedMessage | StateChangedMessage,
  validateContent: (content: unknown) => {
    content: Content
    error?: string
  },
): FieldPluginData<Content> => {
  const validateResult = validateContent(message.model)
  if ('error' in validateResult && typeof validateResult.error === 'string') {
    console.warn(
      `[Warning] The provided content is not valid, but it's still sent to the Visual Editor.`,
    )
    console.warn(`  > ${validateResult.error}`)
  }

  return {
    interfaceLang: message.interfaceLanguage,
    spaceId: message.spaceId ?? undefined,
    story: message.story ?? undefined,
    storyId: message.storyId ?? undefined,
    storyLang: message.language === '' ? 'default' : message.language,
    blockUid: message.blockId ?? undefined,
    token: message.token ?? undefined,
    options: recordFromFieldPluginOptions(message.schema.options),
    translatable: message.schema.translatable ?? false,
    uid: message.uid ?? undefined,
    content: validateResult.content,
    isModalOpen: message.isModalOpen,
    releases: message.releases,
    releaseId: message.releaseId,
  }
}
