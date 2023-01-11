import { MessageToPlugin } from '../../../container-effects/post-to-plugin'
import { hasKey } from '../../../utils'

// TODO better validation
export const isLoadedData = (data: unknown): data is MessageToPlugin =>
  hasKey(data, 'action') && data.action === 'loaded'
