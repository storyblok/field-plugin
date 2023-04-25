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
  originFromPluginParams,
  PluginUrlParams,
  StateChangedMessage,
  urlSearchParamsFromPluginUrlParams,
} from '@storyblok/field-plugin'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ChevronDownIcon,
  ContentIcon,
  RefreshIcon,
  SchemaIcon,
  useNotifications,
  ViewIcon,
} from '@storyblok/mui'
import { SchemaEditor } from './SchemaEditor'
import { ObjectDisplay } from './ObjectDisplay'
import { FieldTypePreview } from './FieldTypePreview'
import { FlexTypography } from './FlexTypography'
import { FieldPluginSchema } from '@storyblok/field-plugin'
import { createContainerMessageListener } from '../dom/createContainerMessageListener'
import { useDebounce } from 'use-debounce'
import { useQueryParam, StringParam, withDefault } from 'use-query-params'

const uid = () => Math.random().toString(32).slice(2)

const wrapperHost = 'localhost:7070'
const defaultUrl = 'http://localhost:8080'

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
  const fieldPluginOrigin = useMemo<string | undefined>(() => {
    try {
      return new URL(debouncedUrl).origin
    } catch {
      return undefined
    }
  }, [debouncedUrl])
  const iframeSrc = `${debouncedUrl}?${urlSearchParamsFromPluginUrlParams(
    pluginParams,
  )}`
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
  const [height, setHeight] = useState(300)
  const [schema, setSchema] = useState<FieldPluginSchema>({
    field_type: 'preview',
    options: [],
  })
  const [value, setValue] = useState<unknown>(undefined)

  const refreshIframe = () => {
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
        typeof fieldPluginOrigin !== 'undefined' &&
          fieldTypeIframe.current?.contentWindow?.postMessage(
            message,
            fieldPluginOrigin,
          )
      } catch (e) {
        error({
          title: 'Failed to post message to plugin',
          message: e instanceof Error ? e.message : undefined,
        })
      }
    },
    [error, fieldPluginOrigin],
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
          iframeOrigin: fieldPluginOrigin,
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
      fieldPluginOrigin,
    ],
  )

  return (
    <Stack>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ChevronDownIcon />}>
          <FlexTypography variant="h2">
            <ViewIcon /> Preview
          </FlexTypography>
        </AccordionSummary>
        <AccordionDetails>
          {typeof fieldPluginOrigin !== 'undefined' && (
            <FieldTypePreview
              src={iframeSrc}
              height={`${height}px`}
              isModal={isModal}
              ref={fieldTypeIframe}
              uid={iframeUid}
            />
          )}
        </AccordionDetails>
        <AccordionActions sx={{ py: 8 }}>
          <FormControl error={typeof fieldPluginOrigin === 'undefined'}>
            <InputLabel
              htmlFor="field-plugin-url"
              shrink
            >
              Field Plugin URL
            </InputLabel>
            <OutlinedInput
              id="field-plugin-url"
              aria-describedby="field-plugin-url-description"
              size="small"
              label="Field Plugin URL"
              value={url || undefined}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={defaultUrl}
              endAdornment={
                <Tooltip title="Reload plugin">
                  <IconButton
                    size="small"
                    onClick={refreshIframe}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              }
            />
            <FormHelperText id="my-helper-text">
              Please enter a valid URL from where a field plugin is served.
            </FormHelperText>
          </FormControl>
        </AccordionActions>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ChevronDownIcon />}>
          <FlexTypography variant="h2">
            <SchemaIcon />
            Schema
          </FlexTypography>
        </AccordionSummary>
        <AccordionDetails>
          <SchemaEditor
            schema={loadedData.schema}
            setSchema={setSchema}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ChevronDownIcon />}>
          <FlexTypography variant="h2">
            <ContentIcon />
            State
          </FlexTypography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack gap={1}>
            <Typography variant="h3">Value</Typography>
            <ObjectDisplay output={value} />
            <Typography variant="h3">Height (px)</Typography>
            <ObjectDisplay output={height} />
            <Typography variant="h3">Schema</Typography>
            <ObjectDisplay output={schema} />
            <Typography variant="h3">Is Modal?</Typography>
            <ObjectDisplay output={isModal} />
            <Typography variant="h3">Story</Typography>
            <ObjectDisplay output={story} />
            <Alert severity="info">
              <AlertTitle>Note</AlertTitle>
              Mutating the story does not automatically update the field plugin.
              You need to click on the Request Context button. Click on the
              button below to mutate the story.
            </Alert>
            <Button
              onClick={onMutateStory}
              size="small"
              color="secondary"
              endIcon={'+1'}
            >
              Mutate Story
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}
