import {
  FunctionComponent,
  createContext,
  useEffect,
  useState,
  ComponentType,
} from 'react'
import {
  type FieldPluginResponse,
  createFieldPlugin,
} from '@storyblok/field-plugin'
import { ReactNode } from 'react'

export const FieldPluginContext = createContext<FieldPluginResponse | null>(
  null,
)

type Props = {
  Error?: ComponentType<{ error: Error }>
  Loading?: ComponentType
  children?: ReactNode
}

export const FieldPluginProvider: FunctionComponent<Props> = ({
  Error,
  Loading,
  children,
}) => {
  const [state, setState] = useState<FieldPluginResponse>({
    type: 'loading',
  })

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  if (state.type === 'loading') {
    return Loading ? <Loading /> : null
  } else if (state.type === 'error') {
    return Error ? <Error error={state.error} /> : null
  } else {
    return (
      <FieldPluginContext.Provider value={state}>
        {children}
      </FieldPluginContext.Provider>
    )
  }
}
