import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

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

  if (manifest.options !== undefined && !Array.isArray(manifest.options)) {
    throw new Error(`When declared, the 'options' property should be an array`)
  }

  manifest.options?.forEach((o) => {
    if (!('name' in o && 'value' in o)) {
      throw new Error(
        `Some of the defined 'options' are invalid. ` +
          `Please, make sure they contain a 'name' and 'value' properties`,
      )
    }
  })
}
