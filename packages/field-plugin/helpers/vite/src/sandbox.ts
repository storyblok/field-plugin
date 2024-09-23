import * as querystring from 'querystring'
import { red, bold } from './utils/text'
import { arrows } from './utils/arrows'
import {
  load,
  manifestExists,
  MANIFEST_FILE_NAME,
  Manifest,
} from '@storyblok/manifest-helper'

export const SANDBOX_BASE_URL = `https://plugin-sandbox.storyblok.com/field-plugin`

export type SandboxQueryParams = {
  url: string
  manifest: Manifest | undefined
}

export const buildQueryString = (params: SandboxQueryParams) => {
  const queryParams: querystring.ParsedUrlQueryInput = {
    url: params.url,
  }

  if (params.manifest !== undefined) {
    queryParams.manifest = JSON.stringify(params.manifest)
  }

  return querystring.stringify(queryParams)
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

const loadManifest = (): Manifest | undefined => {
  try {
    return load()
  } catch (err) {
    displayManifestErrorLoading(err as Error)
    return undefined
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
