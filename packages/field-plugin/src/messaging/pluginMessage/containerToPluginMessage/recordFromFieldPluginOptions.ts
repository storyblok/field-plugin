import { FieldPluginOption } from '../../index'

export const recordFromFieldPluginOptions = (
  options: FieldPluginOption[],
): Record<string, string> =>
  options.reduce(
    (options, option) => {
      options[option.name] = option.value
      return options
    },
    {} as Record<string, string>,
  )
