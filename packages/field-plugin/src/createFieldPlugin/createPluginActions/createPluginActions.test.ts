import { createPluginActions } from './createPluginActions'
import {
  AssetModalChangeMessage,
  GetContextMessage,
  HeightChangeMessage,
  ModalChangeMessage,
  PluginLoadedMessage,
  ValueChangeMessage,
} from '../../messaging'
import { PluginState } from '../PluginState'

const mock = () => ({
  uid: 'abc',
  postToContainer: jest.fn(),
  onUpdateState: jest.fn(),
})

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
          value: randomString,
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

      const statePattern1: Partial<PluginState> = {
        isModalOpen: false,
      }
      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining(statePattern1),
      )

      setModalOpen(true)
      const statePattern2: Partial<PluginState> = {
        isModalOpen: true,
      }
      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining(statePattern2),
      )
    })
    it('sends a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setModalOpen },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      setModalOpen(false)

      const messagePattern1: Partial<ModalChangeMessage> = {
        event: 'toggleModal',
        status: false,
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern1),
      )

      setModalOpen(true)
      const messagePattern2: Partial<ModalChangeMessage> = {
        event: 'toggleModal',
        status: true,
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern2),
      )
    })
  })
  describe('value state change', () => {
    it('updates the value state when setValue is called', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setValue },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const value = '409fjk340wo9jkc0954ij0943iu09c43*&(YT-0c43'
      setValue(value)
      const statePattern: Partial<PluginState> = {
        value,
      }
      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining(statePattern),
      )
    })
    it('send a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setValue },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const value = '0932ui2foiuerhjv98453jeh09c34jwk-0c43'
      setValue(value)
      const messagePattern: Partial<ValueChangeMessage> = {
        event: 'update',
        model: value,
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern),
      )
    })
  })
  describe('height state change', () => {
    it('updates the height state when setHeight is called', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setHeight },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const height = 2403984
      setHeight(height)
      const statePattern: Partial<PluginState> = {
        height,
      }
      expect(onUpdateState).toHaveBeenLastCalledWith(
        expect.objectContaining(statePattern),
      )
    })
    it('send a message to the container with the expected value', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setHeight },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const height = 289437
      setHeight(height)
      const messagePattern: Partial<HeightChangeMessage> = {
        event: 'heightChange',
        height,
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern),
      )
    })
  })
  describe('setPluginReady()', () => {
    it('send a message to the container to receive the initial state', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { setPluginReady },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      setPluginReady()
      const messagePattern: Partial<PluginLoadedMessage> = {
        event: 'loaded',
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern),
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
      const messagePattern: Partial<GetContextMessage> = {
        event: 'getContext',
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern),
      )
    })
  })
  describe('selectAsset()', () => {
    it('send a message to the container to open the asset selector', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const onAssetSelected = jest.fn()
      selectAsset(onAssetSelected)
      const messagePattern: Partial<AssetModalChangeMessage> = {
        event: 'showAssetModal',
      }
      expect(postToContainer).toHaveBeenLastCalledWith(
        expect.objectContaining(messagePattern),
      )
    })
    it('calls the callback function when an asset has been selected by the user', () => {
      const { uid, postToContainer, onUpdateState } = mock()
      const {
        actions: { selectAsset },
        messageCallbacks: { onAssetSelect },
      } = createPluginActions(uid, postToContainer, onUpdateState)
      const onAssetSelected = jest.fn()
      selectAsset(onAssetSelected)
      const filename = 'hello.jpg'
      onAssetSelect({
        uid,
        action: 'asset-selected',
        field: 'dummy',
        filename,
      })
      expect(onAssetSelected).toHaveBeenCalledWith(filename)
    })
  })
})
