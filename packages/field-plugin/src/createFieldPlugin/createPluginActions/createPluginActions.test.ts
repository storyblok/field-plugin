import { createPluginActions } from './createPluginActions'
import {
  AssetModalChangeMessage,
  GetContextMessage,
  HeightChangeMessage,
  ModalChangeMessage,
  ValueChangeMessage,
} from '../../messaging'
import { FieldPluginData } from '../FieldPluginData'

const mock = () => ({
  uid: 'abc',
  postToContainer: jest.fn(),
  onUpdateState: jest.fn(),
})

const TEST_CALLBACK_ID = 'test-callback-id'

jest.mock('../../utils/getRandomString', () => {
  return {
    getRandomString: jest.fn(() => TEST_CALLBACK_ID),
  }
})

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('createPluginActions', () => {
  describe('initial call', () => {
    it('does not send any message to the container', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      createPluginActions(uid, postToContainer, onUpdateState)
      expect(postToContainer).not.toHaveBeenCalled()
    })
    it('updates the state when received from container', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        messageCallbacks: { onStateChange },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const randomString = '3490ruieo4jf984ej89q32jd0i2k3w09k3902'
      onStateChange({
        action: 'loaded',
        uid,
        story: { content: {} },
        storyId: 123,
        token: null,
        schema: { options: [], field_type: 'abc' },
        language: '',
        model: randomString,
        spaceId: null,
        blockId: undefined,
      })
      expect(onUpdateState).toHaveBeenCalledWith(
        expect.objectContaining({
          content: randomString,
        }),
      )
    })
  })
  describe('modal state change', () => {
    it('updates the modal state when setModalOpen is called', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setModalOpen },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      setModalOpen(false)

      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isModalOpen: false,
        } satisfies Partial<FieldPluginData>),
      )

      setModalOpen(true)
      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining({
          isModalOpen: true,
        } satisfies Partial<FieldPluginData>),
      )
    })
    it('sends a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setModalOpen },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      setModalOpen(false)

      expect(postToContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toggleModal',
          status: false,
        } satisfies Partial<ModalChangeMessage>),
      )

      setModalOpen(true)
      expect(postToContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toggleModal',
          status: true,
        } satisfies Partial<ModalChangeMessage>),
      )
    })
  })
  describe('value state change', () => {
    it('updates the value state when setContent is called', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setContent },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const content = '409fjk340wo9jkc0954ij0943iu09c43*&(YT-0c43'
      setContent(content)
      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining({
          content,
        } satisfies Partial<FieldPluginData>),
      )
    })
    it('send a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setContent },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const content = '0932ui2foiuerhjv98453jeh09c34jwk-0c43'
      setContent(content)
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          event: 'update',
          model: content,
        } satisfies Partial<ValueChangeMessage>),
      )
    })
  })
  describe('requestContext()', () => {
    it('send a message to the container to request the story', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { requestContext },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      requestContext()
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          event: 'getContext',
        } satisfies Partial<GetContextMessage>),
      )
    })
  })
  describe('selectAsset()', () => {
    it('send a message to the container to open the asset selector', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      selectAsset()
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          event: 'showAssetModal',
        } satisfies Partial<AssetModalChangeMessage>),
      )
    })
    it('calls the callback function when an asset has been selected by the user', async () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
        messageCallbacks: { onAssetSelect },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const promise = selectAsset()
      const filename = 'hello.jpg'
      onAssetSelect({
        uid,
        action: 'asset-selected',
        field: 'dummy',
        callbackId: TEST_CALLBACK_ID,
        filename,
      })
      const result = await promise
      expect(result).toEqual({ filename })
    })
    it('does not call the callack function when callbackId does not match', async () => {
      const WRONG_CALLBACK_ID = TEST_CALLBACK_ID + '_wrong'
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
        messageCallbacks: { onAssetSelect },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const promise = selectAsset()
      const filename = 'hello.jpg'
      onAssetSelect({
        uid,
        action: 'asset-selected',
        field: 'dummy',
        callbackId: WRONG_CALLBACK_ID,
        filename,
      })
      const resolvedFn = jest.fn()
      const rejectedFn = jest.fn()
      promise.then(resolvedFn).catch(rejectedFn)
      await wait(100)
      expect(resolvedFn).toHaveBeenCalledTimes(0)
      expect(rejectedFn).toHaveBeenCalledTimes(0)
    })
    it('should reject the second selectAsset request if the first one is not resolved yet', async () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      selectAsset()
      const promise2 = selectAsset()
      await expect(promise2).rejects.toMatchInlineSnapshot(
        `"Please wait until an asset is selected before making another request."`,
      )
    })
  })
})
