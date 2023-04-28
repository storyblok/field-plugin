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
  FieldPluginSchema,
  originFromPluginParams,
  PluginUrlParams,
  recordFromFieldPluginOptions,
  StateChangedMessage,
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
  Box,
  Container,
  Stack,
} from '@mui/material'
import { ChevronDownIcon, useNotifications } from '@storyblok/mui'
import { SchemaEditor } from './SchemaEditor'
import { FieldTypePreview } from './FieldTypePreview'
import { createContainerMessageListener } from '../dom/createContainerMessageListener'
import { useDebounce } from 'use-debounce'
import { ValueView } from './ValueView'
import { StringParam, useQueryParam, withDefault } from 'use-query-params'
import { ObjectView } from './ObjectView'
import { SectionHeader } from './SectionHeader'
import { UrlView } from './UrlView'

const uid = () => Math.random().toString(32).slice(2)

const wrapperHost = 'localhost:7070'
const defaultUrl = 'http://localhost:8080'
const initialHeight = 300
const initialWidth = 300

const pluginParams: PluginUrlParams = {
  uid: uid(),
  host: wrapperHost,
  secure: false,
  preview: true,
}

type TestStory = { content: { count: number } }

const UrlQueryParam = withDefault(StringParam, defaultUrl)

export const FieldPluginContainer: FunctionComponent = () => {
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
  }, [fieldPluginURL])
  const [iframeUid, setIframeUid] = useState(uid)

  const [story, setStory] = useState<TestStory>({
    content: {
      count: 0,
    },
  })
  const onMutateStory = () =>
    setStory((oldStory) => ({
      ...oldStory,
      content: {
        ...oldStory.content,
        count: oldStory.content.count + 1,
      },
    }))

  const { error } = useNotifications()

  // State
  // TODO replace with useReducer
  const [isModal, setModal] = useState(false)
  const [height, setHeight] = useState(initialHeight)
  const [schema, setSchema] = useState<FieldPluginSchema>({
    field_type: 'preview',
    options: [],
  })
  const [value, setValue] = useState<unknown>(undefined)

  const handleRefreshIframe = () => {
    setIframeUid(uid)
  }

  const loadedData = useMemo<StateChangedMessage>(
    () => ({
      model: value,
      schema: schema,
      action: 'loaded',
      uid: pluginParams.uid,
      blockId: undefined,
      language: 'default',
      spaceId: null,
      story,
      storyId: undefined,
      token: null,
    }),
    [value, schema, story],
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
        error({
          title: 'Failed to post message to plugin',
          message: e instanceof Error ? e.message : undefined,
        })
      }
    },
    [error, fieldPluginURL],
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
        uid: pluginParams.uid,
        action: 'get-context',
        story: loadedData.story,
      }),
    [dispatchContextRequest, loadedData.story],
  )
  const onAssetSelected = useCallback(
    (field: string) => {
      dispatchAssetSelected({
        uid: pluginParams.uid,
        field,
        action: 'asset-selected',
        filename: `${originFromPluginParams(pluginParams)}/icon.svg`,
      })
    },
    [dispatchAssetSelected],
  )

  useEffect(
    () =>
      createContainerMessageListener(
        {
          setValue,
          setPluginReady: onLoaded,
          setHeight,
          setModalOpen: setModal,
          requestContext: onContextRequested,
          selectAsset: onAssetSelected,
        },
        {
          iframeOrigin: fieldPluginURL?.origin,
          uid: pluginParams.uid,
          window,
        },
      ),
    [
      onLoaded,
      setValue,
      setHeight,
      setModal,
      onAssetSelected,
      onContextRequested,
      fieldPluginURL,
    ],
  )

  return (
    <Container>
      <FieldTypePreview
        src={iframeSrc}
        height={`${height}px`}
        initialWidth={`${initialWidth}px`}
        isModal={isModal}
        ref={fieldTypeIframe}
        uid={iframeUid}
        sx={{ my: 15 }}
      />
      <Container maxWidth="md">
        <Stack gap={10}>
          <UrlView
            url={url}
            setUrl={setUrl}
            onRefresh={handleRefreshIframe}
            error={typeof fieldPluginURL === 'undefined'}
            placeholder={defaultUrl}
          />
          <Stack gap={2}>
            <SectionHeader property="data.options">Options</SectionHeader>
            <SchemaEditor
              schema={loadedData.schema}
              setSchema={setSchema}
            />
          </Stack>
          <ValueView
            value={value}
            setValue={setValue}
          />
          <Box>
            <Accordion>
              <AccordionSummary
                expandIcon={<ChevronDownIcon />}
                sx={{ p: 0 }}
              >
                <SectionHeader property="data">Data</SectionHeader>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <ObjectView
                  output={{
                    value,
                    height,
                    isModal,
                    options: recordFromFieldPluginOptions(schema.options),
                  }}
                />
              </AccordionDetails>
            </Accordion>
          </Box>
        </Stack>
      </Container>
    </Container>
  )
}
