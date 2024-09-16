import * as querystring from 'querystring'
import { bold, red } from './utils/text'
import { arrows } from './utils/arrows'
import { load, manifestExists, MANIFEST_FILE_NAME } from './manifest'
import type { Manifest } from './manifest'
import { isFieldPluginOption } from '@storyblok/field-plugin'

export const SANDBOX_BASE_URL = `https://plugin-sandbox.storyblok.com/field-plugin`

export type SandboxQueryParams = {
  url: string
  manifest: Manifest | null
}

const areOptionsValid = (options: unknown): boolean => {
  if (!Array.isArray(options) || options.length === 0) {
    displayManifestErrorLoading(
      new Error('ERROR: Manifest options must be an array of objects'),
    )
    return false
  }

  const incorrectValues: string[] = []

  for (const option of options) {
    if (!isFieldPluginOption(option)) {
      incorrectValues.push(JSON.stringify(option))
    }
  }

  if (incorrectValues.length > 0) {
    displayManifestErrorLoading(
      new Error(
        'ERROR: Each option must be an object with string properties "name" and "value". The following values need to be corrected: \n ' +
          incorrectValues.join(',\n '),
      ),
    )
    return false
  }

  return true
}

const isManifestValid = (manifest: unknown): boolean => {
  if (typeof manifest !== 'object' || manifest === null) {
    return false
  }

  if ('options' in manifest && manifest.options !== null) {
    return areOptionsValid(manifest.options)
  }

  return true
}

export const buildQueryString = (params: SandboxQueryParams) => {
  const queryParams: querystring.ParsedUrlQueryInput = {
    url: params.url,
  }

  if (params.manifest === null) {
    return querystring.stringify(queryParams)
  }

  if (!isManifestValid(params.manifest)) {
    throw Error('Invalid manifest')
  }

  queryParams.manifest = JSON.stringify(params.manifest)
}

export const generateSandboxUrl = (fieldPluginUrl: string) => {
  displayManifestChecking()

  const queryParams: SandboxQueryParams = {
    url: fieldPluginUrl,
    manifest: loadManifest(),
  }

  const queryString = buildQueryString(queryParams)

  return `${SANDBOX_BASE_URL}?${queryString}`
}

const loadManifest = (): Manifest | null => {
  if (!manifestExists()) return null

  try {
    return load()
  } catch (err) {
    displayManifestErrorLoading(err as Error)
    return null
  }
}

const displayManifestChecking = () => {
  if (manifestExists()) {
    console.log(
      `${arrows.green} ${bold(`Loading manifest file: ${MANIFEST_FILE_NAME}`)}`,
    )
  } else {
    console.log(`${arrows.gray} ${bold(`Manifest file not found`)}`)
  }
}

const displayManifestErrorLoading = (err: Error) =>
  console.log(`${arrows.red} ${red(`${err.message}`)}`)
