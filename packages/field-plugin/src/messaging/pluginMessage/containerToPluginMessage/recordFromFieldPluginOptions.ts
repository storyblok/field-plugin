import { FieldPluginOption } from '../../index'

export const recordFromFieldPluginOptions = (
  options: FieldPluginOption[],
): Record<string, string> =>
  options.reduce(
    (options, option) => {
      // eslint-disable-next-line functional/immutable-data
      options[option.name] = option.value
      return options
    },
    {} as Record<string, string>,
  )
