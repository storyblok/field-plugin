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
  FieldPluginData,
  FieldPluginSchema,
  HeightChangeMessage,
  LoadedMessage,
  ModalChangeMessage,
  originFromPluginParams,
  PluginLoadedMessage,
  recordFromFieldPluginOptions,
  StateChangedMessage,
  StoryData,
  urlSearchParamsFromPluginUrlParams,
  ValueChangeMessage,
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
import { createContainerMessageListener } from '../dom/createContainerMessageListener'
import { useDebounce } from 'use-debounce'
import { ContentView } from './ContentView'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import { ObjectView } from './ObjectView'
import { UrlView } from './UrlView'
import { usePluginParams } from './usePluginParams'
import { LanguageView } from './LanguageView'

const defaultUrl = 'http://localhost:8080'
const initialStory: StoryData = {
  content: {},
}
const initialContent = ''
const initialHeight = 300

const UrlQueryParam = withDefault(StringParam, defaultUrl)

const useSandbox = (
  onError: (message: { title: string; message?: string }) => void,
) => {
  const { pluginParams, randomizeUid } = usePluginParams()
  const { uid } = pluginParams

  const fieldTypeIframe = useRef<HTMLIFrameElement>(null)
  const [url, setUrl] = useQueryParam('url', UrlQueryParam)

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
  const [iframeKey, setIframeKey] = useState(0)

  const [story] = useState<StoryData>(initialStory)

  // TODO replace with useReducer
  const [subscribeState, setSubscribeState] = useState<boolean>(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [height, setHeight] = useState(initialHeight)
  const [fullHeight, setFullHeight] = useState(false)
  const [schema, setSchema] = useState<FieldPluginSchema>({
    field_type: 'preview',
    options: [],
  })
  const [content, setContent] = useState<unknown>(initialContent)
  const [language, setLanguage] = useState<string>('')
  const [stateChangedCallbackId, setStateChangedCallbackId] = useState<string>()

  const stateChangedData = useMemo<StateChangedMessage>(
    () => ({
      model: content,
      schema: schema,
      action: 'state-changed',
      uid,
      blockId: undefined,
      language,
      spaceId: null,
      story,
      storyId: undefined,
      token: null,
      isModalOpen,
      callbackId: stateChangedCallbackId,
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
        typeof fieldPluginURL !== 'undefined' &&
          fieldTypeIframe.current?.contentWindow?.postMessage(
            message,
            fieldPluginURL.origin,
          )
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
    },
    [setModalOpen, setStateChangedCallbackId],
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
  const onAssetSelected = useCallback(
    (message: AssetModalChangeMessage) => {
      dispatchAssetSelected({
        uid,
        field: message.field,
        action: 'asset-selected',
        callbackId: message.callbackId,
        filename: `${originFromPluginParams(pluginParams)}/icon.svg`,
      })
    },
    [uid, pluginParams, dispatchAssetSelected],
  )

  useEffect(
    () =>
      createContainerMessageListener(
        {
          setContent: onUpdate,
          setPluginReady: onLoaded,
          setHeight: onHeightChange,
          setModalOpen: onModalChange,
          requestContext: onContextRequested,
          selectAsset: onAssetSelected,
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
      onHeightChange,
      onModalChange,
      onUpdate,
      fieldPluginURL,
    ],
  )

  return [
    {
      content,
      language,
      isModalOpen,
      height,
      fullHeight,
      schema,
      url,
      fieldTypeIframe,
      iframeSrc,
    },
    {
      setContent,
      setLanguage,
      setSchema,
      setUrl,
      randomizeUid,
    },
  ] as const
}

export const FieldPluginContainer: FunctionComponent = () => {
  const { error } = useNotifications()
  const [
    {
      content,
      language,
      isModalOpen,
      fullHeight,
      height,
      schema,
      url,
      fieldTypeIframe,
      iframeSrc,
    },
    { setContent, setLanguage, setSchema, setUrl, randomizeUid },
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
              isModal={isModalOpen}
              fullHeight={fullHeight}
              ref={fieldTypeIframe}
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
          <Typography variant="h3">Options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <SchemaEditor
            schema={schema}
            setSchema={setSchema}
          />
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
                isModalOpen,
                options: recordFromFieldPluginOptions(schema.options),
              } satisfies Partial<FieldPluginData>
            }
          />
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}
