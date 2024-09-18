import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { getErrorMessage } from './utils/error'

export const MANIFEST_FILE_NAME = 'field-plugin.config.json'
export const MANIFEST_FULL_PATH = resolve(process.cwd(), MANIFEST_FILE_NAME)

export type ManifestOption = {
  name: string
  value: string
}

export type Manifest = {
  options: ManifestOption[]
}

export const load = (): Manifest | undefined => {
  try {
    if (!manifestExists()) {
      return undefined
    }

    const content: string = readFileSync(MANIFEST_FULL_PATH, 'utf8')

    const manifest = JSON.parse(content) as Manifest

    validateSchema(manifest)

    return manifest
  } catch (err) {
    throw new Error(
      'Error while loading the manifest file: ' + getErrorMessage(err),
    )
  }
}

const validateSchema = (manifest: Manifest): void => {
  const allowedProperties = ['options']

  if (typeof manifest !== 'object') {
    throw new Error(`The manifest should be an object`)
  }

  Object.keys(manifest).forEach((prop) => {
    if (!allowedProperties.includes(prop)) {
      throw new Error(`The property ${prop} is not allowed`)
    }
  })

  //NOTE: accepted empty options case
  if (manifest.options === undefined) {
    return
  }

  if (!Array.isArray(manifest.options)) {
    throw new Error(`When declared, the 'options' property should be an array`)
  }

  //NOTE: accepted empty options case
  if (manifest.options.length === 0) {
    return
  }

  validateOptions(manifest.options)
}

const validateOptions = (options: unknown[]): void => {
  const incorrectValues: string[] = []

  for (const option of options) {
    if (!isOptionObject(option)) {
      incorrectValues.push(
        `${JSON.stringify(option)} --> Incorrect object value. Must be of type {"name": string, "value": string}.`,
      )
      continue
    }

    if (!isString(option.value)) {
      incorrectValues.push(
        `${JSON.stringify(option)} --> Incorrect value type. Must be of type string.`,
      )
      continue
    }
  }

  if (incorrectValues.length > 0) {
    throw new Error(
      'Each option must be an object with string properties "name" and "value". The following values need to be corrected: \n ' +
        incorrectValues.join('\n '),
    )
  }
}

export const manifestExists = (): boolean => {
  return existsSync(MANIFEST_FULL_PATH)
}

export const isString = (value: unknown) => typeof value === 'string'

export const isOptionObject = (option: unknown): option is ManifestOption =>
  typeof option === 'object' &&
  option !== null &&
  'name' in option &&
  'value' in option
