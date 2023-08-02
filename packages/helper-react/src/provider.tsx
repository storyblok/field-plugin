import {
  useEffect,
  useState,
  ComponentType,
  useContext,
  createContext,
  FunctionComponent,
} from 'react'
import {
  type FieldPluginResponse,
  createFieldPlugin,
} from '@storyblok/field-plugin'
import { ReactNode } from 'react'

export type FieldPluginProviderProps = {
  Error?: ComponentType<{ error: Error }>
  Loading?: ComponentType
  children?: ReactNode
}

export const createFieldPluginContext = <Content,>(
  parseContent: (content: unknown) => Content,
): {
  FieldPluginProvider: FunctionComponent
  useFieldPlugin: () => Extract<
    FieldPluginResponse<Content>,
    { type: 'loaded' }
  >
} => {
  const FieldPluginContext = createContext<
    Extract<FieldPluginResponse<Content>, { type: 'loaded' }> | undefined
  >(undefined)

  const FieldPluginProvider = (
    props: FieldPluginProviderProps,
  ): JSX.Element => {
    const { Error, Loading, children } = props
    const [state, setState] = useState<FieldPluginResponse<Content>>({
      type: 'loading',
    })

    useEffect(() => createFieldPlugin<Content>(setState, parseContent), [])

    if (state.type === 'loading') {
      return Loading ? <Loading /> : <></>
    } else if (state.type === 'error') {
      return Error ? <Error error={state.error} /> : <></>
    } else {
      return (
        <FieldPluginContext.Provider value={state}>
          {children}
        </FieldPluginContext.Provider>
      )
    }
  }

  const useFieldPlugin = (): Extract<
    FieldPluginResponse<Content>,
    { type: 'loaded' }
  > => {
    const plugin = useContext(FieldPluginContext)
    if (!plugin) {
      throw new Error(
        'The plugin is not loaded, yet `useFieldPlugin()` was invoked. Ensure that the component that invoked `useFieldPlugin()` is wrapped within `<FieldPluginProvider>`.',
      )
    }

    return plugin as Extract<FieldPluginResponse<Content>, { type: 'loaded' }>
  }

  return {
    FieldPluginProvider,
    useFieldPlugin,
  }
}
