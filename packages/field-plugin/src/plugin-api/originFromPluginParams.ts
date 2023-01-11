import { PluginUrlParams } from './index'

export const originFromPluginParams = (
  fieldTypeParams: PluginUrlParams,
): string => `${fieldTypeParams.protocol}//${fieldTypeParams.host}`
