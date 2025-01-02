import { hasKey } from '../../../utils'

/**
 * The user object that is attached to "get-user-context".
 */
export type UserData = {
  isSpaceAdmin: boolean
  permissions: Record<string, string[] | number[]> | undefined
}

export const isUserData = (data: unknown): data is UserData =>
  hasKey(data, 'isSpaceAdmin') &&
  typeof data.isSpaceAdmin === 'boolean' &&
  hasKey(data, 'permissions') &&
  data.permissions !== null &&
  (typeof data.permissions === 'object' ||
    typeof data.permissions === 'undefined') &&
  !Array.isArray(data.permissions)
