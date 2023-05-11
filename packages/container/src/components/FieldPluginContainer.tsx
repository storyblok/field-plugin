import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AssetSelectedMessage,
  ContextRequestMessage,
  FieldPluginData,
  FieldPluginSchema,
  originFromPluginParams,
  recordFromFieldPluginOptions,
  StateChangedMessage,
  StoryData,
  urlSearchParamsFromPluginUrlParams,
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
  Typography,
} from '@mui/material'
import { ChevronDownIcon, useNotifications } from '@storyblok/mui'
import { SchemaEditor } from './SchemaEditor'
import { FieldTypePreview } from './FieldTypePreview'
import { createContainerMessageListener } from '../dom/createContainerMessageListener'
import { useDebounce } from 'use-debounce'
import { ContentView } from './ContentView'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import { ObjectView } from './ObjectView'
import { UrlView } from './UrlView'
import { usePluginParams } from './usePluginParams'

const defaultUrl = 'http://localhost:8080'
const initialStory: StoryData = {
  content: {},
  lang: 'default',
}
const initialContent = ''
const initialHeight = 300
const initialWidth = 300

const UrlQueryParam = withDefault(StringParam, defaultUrl)

const useSandbox = (
  onError: (message: { title: string; message?: string }) => void,
) => {
  const pluginParams = usePluginParams()
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
  const [iframeUid, setIframeUid] = useState(uid)

  const [story] = useState<StoryData>(initialStory)

  // TODO replace with useReducer
  const [isModalOpen, setModalOpen] = useState(false)
  const [height, setHeight] = useState(initialHeight)
  const [schema, setSchema] = useState<FieldPluginSchema>({
    field_type: 'preview',
    options: [],
  })
  const [content, setContent] = useState<unknown>(initialContent)

  const refreshIframe = () => {
    setIframeUid(uid)
  }

  const loadedData = useMemo<StateChangedMessage>(
    () => ({
      model: content,
      schema: schema,
      action: 'loaded',
      uid,
      blockId: undefined,
      language: 'default',
      spaceId: null,
      story,
      storyId: undefined,
      token: null,
    }),
    [uid, content, schema, story],
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

  const dispatchStateChanged = useCallback(
    (message: StateChangedMessage) => {
      postToPlugin(message)
    },
    [postToPlugin],
  )
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
  const onLoaded = useCallback(() => {
    dispatchStateChanged(loadedData)
  }, [dispatchStateChanged, loadedData])

  useEffect(onLoaded, [onLoaded])

  const onContextRequested = useCallback(
    () =>
      dispatchContextRequest({
        uid,
        action: 'get-context',
        story: loadedData.story,
      }),
    [uid, dispatchContextRequest, loadedData.story],
  )
  const onAssetSelected = useCallback(
    (field: string) => {
      dispatchAssetSelected({
        uid,
        field,
        action: 'asset-selected',
        filename: `${originFromPluginParams(pluginParams)}/icon.svg`,
      })
    },
    [uid, pluginParams, dispatchAssetSelected],
  )

  useEffect(
    () =>
      createContainerMessageListener(
        {
          setContent,
          setPluginReady: onLoaded,
          setHeight,
          setModalOpen: setModalOpen,
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
      fieldPluginURL,
    ],
  )

  return [
    {
      content,
      isModalOpen,
      height,
      schema,
      url,
      fieldTypeIframe,
      iframeSrc,
      iframeUid,
    },
    {
      setContent,
      setSchema,
      setUrl,
      refreshIframe,
    },
  ] as const
}

export const FieldPluginContainer: FunctionComponent = () => {
  const { error } = useNotifications()
  const [
    {
      content,
      isModalOpen,
      height,
      schema,
      url,
      fieldTypeIframe,
      iframeSrc,
      iframeUid,
    },
    { setContent, setSchema, setUrl, refreshIframe },
  ] = useSandbox(error)

  return (
    <Container>
      <FieldTypePreview
        src={iframeSrc}
        height={`${height}px`}
        initialWidth={`${initialWidth}px`}
        isModal={isModalOpen}
        ref={fieldTypeIframe}
        uid={iframeUid}
        sx={{ my: 15 }}
      />
      <Container maxWidth="md">
        <UrlView
          url={url}
          setUrl={setUrl}
          onRefresh={refreshIframe}
          error={typeof iframeSrc === 'undefined'}
          placeholder={defaultUrl}
        />
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ChevronDownIcon />}
            sx={{ p: 0 }}
          >
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
          <AccordionSummary
            expandIcon={<ChevronDownIcon />}
            sx={{ p: 0 }}
          >
            <Typography variant="h3">Content</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ position: 'relative' }}>
            <ContentView
              content={content}
              setContent={setContent}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ChevronDownIcon />}
            sx={{ p: 0 }}
          >
            <Typography variant="h3">Data</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
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
    </Container>
  )
}
