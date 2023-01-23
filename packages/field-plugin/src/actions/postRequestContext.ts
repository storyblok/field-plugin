import { postPluginMessage } from './postPluginMessage'
import { RequestContext } from './index'

/**
 * TODO document what this does. Should it be exposed to the client? When should it be used?
 */
export const postRequestContext: RequestContext = () =>
  postPluginMessage({
    event: 'getContext',
  })
