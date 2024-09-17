/* eslint-disable functional/no-throw-statement */
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
    if (!existsSync(MANIFEST_FULL_PATH)) {
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

  if (manifest.options !== undefined && !Array.isArray(manifest.options)) {
    throw new Error(`The 'options' property should be an array`)
  }

  //TODO: update this to use the new validation functions
  manifest.options?.forEach((option) => {
    if (!('name' in option && 'value' in option)) {
      throw new Error(
        `Some of the defined 'options' are invalid. ` +
          `Please, make sure they contain a 'name' and 'value' properties`,
      )
    }
  })
}
