import { PluginUrlParams } from '../PluginUrlParams'

export const originFromPluginParams = (
  fieldTypeParams: PluginUrlParams,
): string =>
  `${fieldTypeParams.secure ? 'https' : 'http'}://${fieldTypeParams.host}`
