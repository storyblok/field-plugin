import { ManifestOption } from '../manifest.ts'

export const isString = (value: unknown) => typeof value === 'string'

export const isEmpty = (value: string) => value === ''

export const isOptionObject = (option: unknown): option is ManifestOption =>
  typeof option === 'object' &&
  option !== null &&
  'name' in option &&
  'value' in option
