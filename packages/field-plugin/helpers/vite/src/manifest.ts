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

export const fileExists = (): boolean => {
  return existsSync(MANIFEST_FULL_PATH)
}

export const load = (): Manifest => {
  try {
    const content: string = readFileSync(MANIFEST_FULL_PATH, {
      encoding: 'utf-8',
    })

    return JSON.parse(content) as Manifest
  } catch (err: any) {
    throw new Error('Error while loading the manifest file: ' + err.message)
  }
}
