import { postMessageToContainer } from './postMessageToContainer'
import { OnGetContext } from '../../plugin-api/types'

/**
 * TODO document what this does. Should it be exposed to the client? When should it be used?
 */
export const postGetContextToContainer: OnGetContext = () =>
  postMessageToContainer({
    event: 'getContext',
  })
