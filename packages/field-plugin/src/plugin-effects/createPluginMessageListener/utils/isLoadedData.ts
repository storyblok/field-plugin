import { MessageToPlugin } from '../../../container-effects'
import { hasKey } from '../../../utils'

// TODO better validation
export const isLoadedData = (data: unknown): data is MessageToPlugin =>
  hasKey(data, 'action') && data.action === 'loaded'
