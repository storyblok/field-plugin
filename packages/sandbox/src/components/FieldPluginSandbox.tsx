import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AssetModalChangeMessage,
  AssetSelectedMessage,
  ContextRequestMessage,
  GetUserContextMessage,
  UserContextRequestMessage,
  FieldPluginData,
  FieldPluginOption,
  FieldPluginSchema,
  HeightChangeMessage,
  LoadedMessage,
  ModalChangeMessage,
  originFromPluginParams,
  PluginLoadedMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
  StoryData,
  UserData,
  urlSearchParamsFromPluginUrlParams,
  ValueChangeMessage,
  PreviewDimensionChangeMessage,
} from '@storyblok/field-plugin'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import { CenteredContent, useNotifications } from '@storyblok/mui'
import { SchemaEditor } from './SchemaEditor'
import { FieldTypePreview } from './FieldTypePreview'
import { createSandboxMessageListener } from '../dom/createSandboxMessageListener'
import { useDebounce } from 'use-debounce'
import { ContentView } from './ContentView'
import {
  StringParam,
  JsonParam,
  useQueryParam,
  withDefault,
} from 'use-query-params'
import { ObjectView } from './ObjectView'
import { UrlView } from './UrlView'
import { usePluginParams } from './usePluginParams'
import { LanguageView } from './LanguageView'
import { TranslatableCheckbox } from './TranslatableCheckbox'
import { PreviewDimension } from './PreviewDimension'

const defaultUrl = 'http://localhost:8080'
const initialStory: StoryData = {
  content: {},
}
const initialUser: UserData = {
  isSpaceAdmin: true,
  permissions: undefined,
}
const initialContent = ''
const initialHeight = 300
const defaultManifest = { options: [] }

const urlQueryParam = withDefault(StringParam, defaultUrl)
const manifestQueryParam = withDefault(JsonParam, defaultManifest)

export type ModalState =
  | 'non-modal'
  | 'modal-with-portal'
  | 'modal-without-portal'

const useSandbox = (
  onError: (message: { title: string; message?: string }) => void,
) => {
  const { pluginParams, randomizeUid } = usePluginParams()
  const { uid } = pluginParams

  const fieldTypeIframe = useRef<HTMLIFrameElement>(null)
  const [url, setUrl] = useQueryParam('url', urlQueryParam)
  const [manifest] = useQueryParam<{
    options: FieldPluginOption[]
  }>('manifest', manifestQueryParam)

  // Fall back to defaultUrl when the url is an empty string; otherwise, the iframe will embed the same origin, which will look strange.
  const [debouncedUrl] = useDebounce(url, 1000)
  const fieldPluginURL = useMemo<URL | undefined>(() => {
    try {
      const url = new URL(debouncedUrl)
      // When the origin is invalid `URL()` will parse it as `"null"`... yes as a string with content "null"
      if (url.origin === 'null') {
        return undefined
      }
      return url
    } catch {
      return undefined
    }
  }, [debouncedUrl])
  const iframeSrc = useMemo(() => {
    if (!fieldPluginURL) {
      return undefined
    }
    // Omitting query parameters from the user-provided URL in a safe way
    return `${fieldPluginURL.origin}${
      fieldPluginURL.pathname
    }?${urlSearchParamsFromPluginUrlParams(pluginParams)}`
  }, [fieldPluginURL, pluginParams])

  const [story] = useState<StoryData>(initialStory)
  const [user] = useState<UserData>(initialUser)

  // TODO replace with useReducer
  const [subscribeState, setSubscribeState] = useState<boolean>(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [modalHeight, setModalHeight] = useState<string>('')
  const [modalWidth, setModalWidth] = useState<string>('')
  const [height, setHeight] = useState(initialHeight)
  const [fullHeight, setFullHeight] = useState(false)
  const [enablePortalModal, setEnablePortalModal] = useState(false)
  const [schema, setSchema] = useState<FieldPluginSchema>({
    field_type: 'preview',
    options: manifest.options,
    translatable: false,
  })
  const [content, setContent] = useState<unknown>(initialContent)
  const [previewDimension, setPreviewDimension] = useState<
    PreviewDimensionChangeMessage['data']
  >({
    tag: 'desktop',
  })
  const [language, setLanguage] = useState<string>('default')
  const [stateChangedCallbackId, setStateChangedCallbackId] = useState<string>()

  const stateChangedData = useMemo<StateChangedMessage>(
    () => ({
      model: content,
      schema: schema,
      interfaceLanguage: 'en',
      action: 'state-changed',
      uid,
      blockId: undefined,
      language,
      spaceId: null,
      userId: undefined,
      story,
      storyId: undefined,
      token: null,
      isAIEnabled: false,
      isModalOpen,
      callbackId: stateChangedCallbackId,
      releases: [],
      releaseId: undefined,
    }),
    [
      uid,
      content,
      language,
      schema,
      story,
      isModalOpen,
      stateChangedCallbackId,
    ],
  )

  const postToPlugin = useCallback(
    (message: unknown) => {
      try {
        if (typeof fieldPluginURL !== 'undefined') {
          fieldTypeIframe.current?.contentWindow?.postMessage(
            message,
            fieldPluginURL.origin,
          )
        }
      } catch (e) {
        onError({
          title: 'Failed to post message to plugin',
          message: e instanceof Error ? e.message : undefined,
        })
      }
    },
    [onError, fieldPluginURL],
  )

  const dispatchLoadedChanged = useCallback(
    (message: LoadedMessage) => {
      postToPlugin(message)
    },
    [postToPlugin],
  )
  const dispatchStateChanged = useCallback(
    (message: StateChangedMessage) => {
      postToPlugin(message)
    },
    [postToPlugin],
  )
  useEffect(() => {
    if (!subscribeState) {
      return
    }

    dispatchStateChanged(stateChangedData)
  }, [dispatchStateChanged, subscribeState, stateChangedData])

  const dispatchContextRequest = useCallback(
    (message: ContextRequestMessage) => {
      postToPlugin(message)
    },
    [postToPlugin],
  )

  const dispatchUserContextRequest = useCallback(
    (message: UserContextRequestMessage) => {
      postToPlugin(message)
    },
    [postToPlugin],
  )
  const dispatchAssetSelected = useCallback(
    (message: AssetSelectedMessage) => {
      postToPlugin(message)
    },
    [postToPlugin],
  )

  // Listen to messages from field type iframe
  const onModalChange = useCallback(
    (message: ModalChangeMessage) => {
      setModalOpen(message.status)
      setStateChangedCallbackId(message.callbackId)
      if (message.modalSize) {
        setModalHeight(message.modalSize.height || '')
        setModalWidth(message.modalSize.width || '')
      }
    },
    [setModalOpen, setStateChangedCallbackId, setModalHeight, setModalWidth],
  )

  const onHeightChange = useCallback(
    (message: HeightChangeMessage) => {
      setHeight(message.height)
    },
    [setHeight],
  )

  const onLoaded = useCallback(
    (message: PluginLoadedMessage) => {
      setSubscribeState(Boolean(message.subscribeState))
      setFullHeight(Boolean(message.fullHeight))
      setEnablePortalModal(Boolean(message.enablePortalModal))
      dispatchLoadedChanged({
        ...stateChangedData,
        action: 'loaded',
        callbackId: message.callbackId,
      })
    },
    [dispatchLoadedChanged, stateChangedData],
  )

  const onUpdate = useCallback(
    (message: ValueChangeMessage) => {
      setContent(message.model)
      setStateChangedCallbackId(message.callbackId)
    },
    [setContent, setStateChangedCallbackId],
  )

  const onContextRequested = useCallback(
    () =>
      dispatchContextRequest({
        uid,
        action: 'get-context',
        story,
      }),
    [uid, dispatchContextRequest, story],
  )

  const onUserContextRequested = useCallback(
    (message: GetUserContextMessage) =>
      dispatchUserContextRequest({
        uid,
        action: 'get-user-context',
        user,
        callbackId: message.callbackId,
      }),
    [uid, dispatchUserContextRequest, user],
  )

  const onAssetSelected = useCallback(
    (message: AssetModalChangeMessage) => {
      dispatchAssetSelected({
        uid,
        field: message.field,
        action: 'asset-selected',
        callbackId: message.callbackId,
        filename: `${originFromPluginParams(pluginParams)}/icon.svg`,
        asset: {
          id: 0,
          filename: `${originFromPluginParams(pluginParams)}/icon.svg`,
          fieldtype: 'asset',
          name: '',
          meta_data: {},
          title: '',
          copyright: '',
          focus: '',
          alt: '',
          source: '',
          is_private: false,
        },
      })
    },
    [uid, pluginParams, dispatchAssetSelected],
  )

  const onPromptAI = useCallback(
    () =>
      onError({
        title: 'AI Prompt',
        message: 'AI Prompt is not supported in the sandbox',
      }),
    [onError],
  )

  const onSetPreviewDimension = useCallback(
    (message: PreviewDimensionChangeMessage) => {
      setPreviewDimension(message.data)

      postToPlugin({
        uid,
        action: 'preview-dimension',
        callbackId: message.callbackId,
      })
    },
    [],
  )

  useEffect(
    () =>
      createSandboxMessageListener(
        {
          setContent: onUpdate,
          setPluginReady: onLoaded,
          setHeight: onHeightChange,
          setModalOpen: onModalChange,
          requestContext: onContextRequested,
          requestUserContext: onUserContextRequested,
          selectAsset: onAssetSelected,
          promptAI: onPromptAI,
          setPreviewDimension: onSetPreviewDimension,
        },
        {
          iframeOrigin: fieldPluginURL?.origin,
          uid,
          window,
        },
      ),
    [
      uid,
      onLoaded,
      setContent,
      setHeight,
      setModalOpen,
      onAssetSelected,
      onContextRequested,
      onUserContextRequested,
      onHeightChange,
      onModalChange,
      onUpdate,
      onPromptAI,
      fieldPluginURL,
    ],
  )

  const modalState = useMemo<ModalState>(() => {
    if (!isModalOpen) {
      return 'non-modal'
    } else if (enablePortalModal) {
      return 'modal-with-portal'
    } else {
      return 'modal-without-portal'
    }
  }, [isModalOpen, enablePortalModal])

  return [
    {
      content,
      language,
      height,
      fullHeight,
      modalState,
      modalHeight,
      modalWidth,
      schema,
      url,
      fieldTypeIframe,
      iframeSrc,
      previewDimension,
    },
    {
      setContent,
      setLanguage,
      setSchema,
      setUrl,
      randomizeUid,
      setModalOpen,
    },
  ] as const
}

export const FieldPluginSandbox: FunctionComponent = () => {
  const { error } = useNotifications()
  const [
    {
      content,
      language,
      modalState,
      modalHeight,
      modalWidth,
      fullHeight,
      height,
      schema,
      url,
      fieldTypeIframe,
      iframeSrc,
      previewDimension,
    },
    { setModalOpen, setContent, setLanguage, setSchema, setUrl, randomizeUid },
  ] = useSandbox(error)

  return (
    <Container maxWidth="md">
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography variant="h3">Preview</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <CenteredContent
            component="div"
            sx={{
              p: 10,
              display: 'block',
              resize: 'horizontal',
              minWidth: '100px',
              width: '100%',
              overflow: 'auto',
            }}
          >
            <FieldTypePreview
              src={iframeSrc}
              height={height}
              modalState={modalState}
              modalHeight={modalHeight}
              modalWidth={modalWidth}
              fullHeight={fullHeight}
              ref={fieldTypeIframe}
              onModalChange={setModalOpen}
            />
          </CenteredContent>
          <Stack alignSelf="flex-start">
            <UrlView
              url={url}
              setUrl={setUrl}
              // Randomizing the uid will change the url which in turn refreshes the iframe window
              onRefresh={randomizeUid}
              error={typeof iframeSrc === 'undefined'}
              placeholder={defaultUrl}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography variant="h3">Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            width="xs"
            gap={5}
          >
            <SchemaEditor
              schema={schema}
              setSchema={setSchema}
            />
            <TranslatableCheckbox
              isTranslatable={schema.translatable}
              setTranslatable={(e) => setSchema({ ...schema, translatable: e })}
            />
            <LanguageView
              sx={{
                alignSelf: 'flex-start',
              }}
              language={language}
              setLanguage={setLanguage}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography variant="h3">Content</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            width="xs"
            gap={5}
          >
            <ContentView
              content={content}
              setContent={setContent}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography variant="h3">Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ObjectView
            title={
              <Typography variant="caption">
                FieldPluginResponse.data
              </Typography>
            }
            output={
              {
                content,
                isModalOpen: modalState !== 'non-modal',
                translatable: schema.translatable,
                storyLang: language,
                options: recordFromFieldPluginOptions(schema.options),
              } satisfies Partial<FieldPluginData<unknown>>
            }
          />
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary>
          <Typography variant="h3">Editor Preview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <PreviewDimension previewDimension={previewDimension} />
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}
