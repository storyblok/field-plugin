import { createPluginActions } from './createPluginActions'
import {
  AssetModalChangeMessage,
  GetContextMessage,
  ModalChangeMessage,
  ValueChangeMessage,
} from '../../messaging'
import { emptyAsset } from '../../messaging/pluginMessage/containerToPluginMessage/Asset.test'

// INFO: The methods like `setContent` is not being resolved in this file because `pushCallback` doesn't resolve.
// We can also mock `callbackQueue` and make it resolve, and resolve this `no-floating-promises` issue.
//

const mock = () => ({
  uid: 'abc',
  postToContainer: vi.fn(),
  onUpdateState: vi.fn(),
})

const TEST_CALLBACK_ID = 'test-callback-id'

vi.mock('../../utils/getRandomUid', () => {
  return {
    getRandomUid: vi.fn(() => TEST_CALLBACK_ID),
  }
})

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const validateContent = (content: unknown) => ({
  content,
})

describe('createPluginActions', () => {
  describe('initial call', () => {
    it('does not send any message to the container', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
      expect(postToContainer).not.toHaveBeenCalled()
    })
    it('updates the state when received from container', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        messageCallbacks: { onLoaded },
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
      const randomString = '3490ruieo4jf984ej89q32jd0i2k3w09k3902'
      onLoaded({
        action: 'loaded',
        isModalOpen: false,
        uid,
        story: { content: {} },
        storyId: 123,
        token: null,
        schema: { options: [], field_type: 'abc', translatable: false },
        language: '',
        interfaceLanguage: 'en',
        model: randomString,
        spaceId: null,
        userId: undefined,
        userPermissions: undefined,
        isSpaceAdmin: false,
        blockId: undefined,
        isAIEnabled: false,
        releases: [],
        releaseId: undefined,
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
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
      setModalOpen(false)

      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: false,
        } satisfies Partial<ModalChangeMessage>),
      )

      setModalOpen(true)
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: true,
        } satisfies Partial<ModalChangeMessage>),
      )
    })
    it('sends a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setModalOpen },
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
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
    it('sends modalSize to the container when opening the modal', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setModalOpen },
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })

      setModalOpen(true, { width: '50%' })
      expect(postToContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toggleModal',
          status: true,
          modalSize: { width: '50%' },
        } satisfies Partial<ModalChangeMessage>),
      )

      setModalOpen(true, { height: '50%' })
      expect(postToContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toggleModal',
          status: true,
          modalSize: { height: '50%' },
        } satisfies Partial<ModalChangeMessage>),
      )

      setModalOpen(true, { width: '50%', height: '50%' })
      expect(postToContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'toggleModal',
          status: true,
          modalSize: { width: '50%', height: '50%' },
        } satisfies Partial<ModalChangeMessage>),
      )
    })
  })
  describe('value state change', () => {
    it('updates the value state when setContent is called', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setContent },
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
      const content = '409fjk340wo9jkc0954ij0943iu09c43*&(YT-0c43'
      setContent(content)
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining({
          model: content,
        } satisfies Partial<ValueChangeMessage>),
      )
    })
    it('send a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setContent },
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
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
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
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
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
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
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
      const promise = selectAsset()
      const filename = 'hello.jpg'
      onAssetSelect({
        uid,
        action: 'asset-selected',
        field: 'dummy',
        callbackId: TEST_CALLBACK_ID,
        filename,
        asset: emptyAsset,
      })
      const result = await promise
      expect(result).toEqual(emptyAsset)
    })
    it('does not call the callack function when callbackId does not match', async () => {
      const WRONG_CALLBACK_ID = TEST_CALLBACK_ID + '_wrong'
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
        messageCallbacks: { onAssetSelect },
      } = createPluginActions({
        uid,
        postToContainer,
        onUpdateState,
        validateContent,
      })
      const promise = selectAsset()
      const filename = 'hello.jpg'
      onAssetSelect({
        uid,
        action: 'asset-selected',
        field: 'dummy',
        callbackId: WRONG_CALLBACK_ID,
        filename,
        asset: emptyAsset,
      })
      const resolvedFn = vi.fn()
      const rejectedFn = vi.fn()
      promise.then(resolvedFn).catch(rejectedFn)
      await wait(100)
      expect(resolvedFn).toHaveBeenCalledTimes(0)
      expect(rejectedFn).toHaveBeenCalledTimes(0)
    })
  })
})
