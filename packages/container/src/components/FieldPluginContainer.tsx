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
  IconButton,
  InputBase,
  Paper,
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

const uid = () => Math.random().toString(32).slice(2)

const wrapperHost = 'localhost:7070'
const defaultPluginOrigin = 'http://localhost:8080'

const pluginParams: PluginUrlParams = {
  uid: uid(),
  host: wrapperHost,
  secure: false,
  preview: true,
}

export const FieldPluginContainer: FunctionComponent = () => {
  const fieldTypeIframe = useRef<HTMLIFrameElement>(null)
  const [iframeOrigin, setIframeOrigin] = useState(defaultPluginOrigin)
  const urlSearchParams = urlSearchParamsFromPluginUrlParams(pluginParams)
  const iframeSrc = `${iframeOrigin}?${urlSearchParams}`
  const [iframeUid, setIframeUid] = useState(uid)

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
      story: undefined,
      storyId: undefined,
      token: null,
    }),
    [value, schema],
  )

  const postToPlugin = useCallback(
    (message: unknown) => {
      try {
        fieldTypeIframe.current?.contentWindow?.postMessage(
          message,
          iframeOrigin,
        )
      } catch (e) {
        error({
          title: 'Failed to post message to plugin',
          message: e instanceof Error ? e.message : undefined,
        })
      }
    },
    [error, iframeOrigin],
  )

  const dispatchStateChanged = useCallback(
    (message: StateChangedMessage) => {
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

  // Sync field type with the state
  // Unfortunately, it is not possible to sync isModal or height this way
  useEffect(() => {
    dispatchStateChanged(loadedData)
  }, [dispatchStateChanged, loadedData])
  // Listen to messages from field type iframe
  const onLoaded = useCallback(() => {
    dispatchStateChanged(loadedData)
  }, [dispatchStateChanged, loadedData])
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

  const onGetContext = useCallback(() => {
    error('getContext has not been implemented yet')
  }, [error])

  useEffect(
    () =>
      createContainerMessageListener(
        {
          setValue,
          setPluginReady: onLoaded,
          setHeight,
          setModalOpen: setModal,
          requestContext: onGetContext,
          selectAsset: onAssetSelected,
        },
        {
          iframeOrigin,
          uid: pluginParams.uid,
          window,
        },
      ),
    [
      iframeOrigin,
      onLoaded,
      setValue,
      setHeight,
      setModal,
      onGetContext,
      onAssetSelected,
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
          <FieldTypePreview
            src={iframeSrc}
            height={`${height}px`}
            isModal={isModal}
            ref={fieldTypeIframe}
            uid={iframeUid}
          />
        </AccordionDetails>
        <AccordionActions onClick={refreshIframe}>
          <Paper
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <InputBase
              size="small"
              value={iframeOrigin}
              onChange={(e) => setIframeOrigin(e.target.value)}
              placeholder={defaultPluginOrigin}
              sx={{
                pt: 1,
                width: '10em',
              }}
            />
            <Tooltip title="Reload plugin">
              <IconButton size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Paper>
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
          <Typography variant="h3">Value</Typography>
          <ObjectDisplay output={value} />
          <Typography variant="h3">Height (px)</Typography>
          <ObjectDisplay output={height} />
          <Typography variant="h3">Schema</Typography>
          <ObjectDisplay output={schema} />
          <Typography variant="h3">Is Modal?</Typography>
          <ObjectDisplay output={isModal} />
        </AccordionDetails>
      </Accordion>
    </Stack>
  )
}
