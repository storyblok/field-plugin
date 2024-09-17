import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { isOptionObject, isString } from './validation/manifest.ts'

export const MANIFEST_FILE_NAME = 'field-plugin.config.json'
export const MANIFEST_FULL_PATH = resolve(process.cwd(), MANIFEST_FILE_NAME)

export type ManifestOption = {
  name: string
  value: string
}

export type Manifest = {
  options: ManifestOption[]
}

export const manifestExists = (): boolean => {
  return existsSync(MANIFEST_FULL_PATH)
}

export const load = (): Manifest => {
  try {
    const content: string = readFileSync(MANIFEST_FULL_PATH, 'utf8')

    const manifest: Manifest = JSON.parse(content)

    validateSchema(manifest)

    return manifest
  } catch (err: any) {
    throw new Error('Error while loading the manifest file: ' + err.message)
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

  validateOptions(manifest.options)
}

//NOTE: There is a duplicate of this function in the manifest-helper/src/manifest.ts file
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
