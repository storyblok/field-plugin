import { FunctionComponent, createContext, useEffect, useState } from 'react'
import {
  type FieldPluginResponse,
  createFieldPlugin,
} from '@storyblok/field-plugin'
import { ReactNode } from 'react'

export const FieldPluginContext = createContext<FieldPluginResponse | null>(
  null,
)

type Props = {
  error?: FunctionComponent<{ error: Error }>
  loading?: FunctionComponent
  children: ReactNode
}

export const FieldPluginProvider: FunctionComponent<Props> = ({
  error,
  loading,
  children,
}) => {
  const [state, setState] = useState<FieldPluginResponse>({
    type: 'loading',
  })

  useEffect(() => {
    return createFieldPlugin(setState)
  }, [])

  if (state.type === 'loading') {
    return loading ? loading({}) : null
  } else if (state.type === 'error') {
    return error ? error({ error: state.error }) : null
  } else {
    return (
      <FieldPluginContext.Provider value={state}>
        {children}
      </FieldPluginContext.Provider>
    )
  }
}
