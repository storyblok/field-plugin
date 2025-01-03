import { isMessageToPlugin, MessageToPlugin } from './MessageToPlugin'
import { hasKey } from '../../../utils'
import { isUserData, UserData } from './UserData'

export type UserContextRequestMessage = MessageToPlugin<'get-user-context'> & {
  user: UserData
}

export const isUserContextRequestMessage = (
  data: unknown,
): data is UserContextRequestMessage =>
  isMessageToPlugin(data) &&
  data.action === 'get-user-context' &&
  hasKey(data, 'user') &&
  isUserData(data.user)
