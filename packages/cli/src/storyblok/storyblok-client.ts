import { red } from 'kleur/colors'
import type { Response } from 'node-fetch'
import { ManifestOption } from '@storyblok/manifest-helper/src/manifest'

export type FieldType = {
  id: number
  name: string
  body: string
  options?: ManifestOption[]
}

export type Scope = 'my-plugins' | 'partner-portal' | 'organization'

type IsAuthenticatedFunc = () => Promise<boolean>

type CreateFieldTypeFunc = (body: {
  name: string
  body?: unknown
}) => Promise<FieldType>

type UpdateFieldTypeFunc = (args: {
  id: number
  field_type: Partial<FieldType>
  publish: boolean
}) => Promise<void>

type FetchFieldTypesFunc = (page?: number) => Promise<FieldType[]>

type FieldPluginResponse = {
  error?: string
  field_type: FieldType
}

export type StoryClientType = {
  isAuthenticated: IsAuthenticatedFunc
  fetchAllFieldTypes: FetchFieldTypesFunc
  createFieldType: CreateFieldTypeFunc
  updateFieldType: UpdateFieldTypeFunc
}

type StoryblokClientFunc = (params: {
  token: string
  scope: Scope
}) => StoryClientType

export const StoryblokClient: StoryblokClientFunc = ({ token, scope }) => {
  const FIELD_TYPES_API_ENDPOINT = getFieldPluginAPIEndpoint(scope)

  const headers = {
    Authorization: token ?? '',
    'Content-Type': 'application/json',
  }

  const isAuthenticated: IsAuthenticatedFunc = async () => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`${FIELD_TYPES_API_ENDPOINT}`, {
      method: 'GET',
      headers,
    })
    return response.ok
  }

  const fetchFieldTypes: FetchFieldTypesFunc = async (page = 1) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`${FIELD_TYPES_API_ENDPOINT}?page=${page}`, {
      method: 'GET',
      headers,
    })
    const json = (await response.json()) as {
      error?: string
      field_types: FieldType[]
    }
    handleErrorIfExists(response, json)
    return json.field_types
  }

  const fetchAllFieldTypes = async () => {
    const results: FieldType[] = []

    // eslint-disable-next-line functional/no-loop-statement, functional/no-let
    for (let page = 1; page <= 100; page++) {
      const fieldTypes = await fetchFieldTypes(page)
      if (fieldTypes.length === 0) {
        break
      }
      // eslint-disable-next-line functional/immutable-data
      results.push(...fieldTypes)
    }
    return results
  }

  const updateFieldType: UpdateFieldTypeFunc = async ({
    id,
    field_type,
    publish,
  }) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`${FIELD_TYPES_API_ENDPOINT}${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        field_type,
        publish,
      }),
    })
    // The Update API returns an empty string as response body
    handleErrorIfExists(response, {})
  }

  const createFieldType: CreateFieldTypeFunc = async (body) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`${FIELD_TYPES_API_ENDPOINT}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        field_type: body,
      }),
    })
    const json = (await response.json()) as FieldPluginResponse

    handleErrorIfExists(response, json)

    return json.field_type
  }

  return {
    isAuthenticated,
    fetchAllFieldTypes,
    updateFieldType,
    createFieldType,
  }
}

const handleErrorIfExists = (
  response: Response,
  json: { error?: string } & Record<string, unknown>,
) => {
  if (!response.ok) {
    console.log(red('[ERROR]'))
    console.log(`  > status: ${response.status}`)
    console.log(`  > statusText: ${response.statusText}`)
    console.log('')
    console.log(JSON.stringify(json, null, 2))
    process.exit(1)
  }

  if (typeof json.error !== 'undefined' && json.error !== null) {
    if (json.error === 'Unauthorized') {
      console.log(
        red('[ERROR]'),
        'Token to access Storyblok is undefined or invalid.',
      )
      console.log(
        'Please provide a valid --token option value or STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable',
      )
    } else {
      console.log(red('[ERROR]'), 'Failed to fetch field types.')
      console.log(`  > ${json.error}`)
    }
    process.exit(1)
  }
}

const getFieldPluginAPIEndpoint = (scope: Scope) => {
  if (scope === 'partner-portal') {
    return 'https://mapi.storyblok.com/v1/partner_field_types/'
  }
  if (scope === 'organization') {
    return 'https://app.storyblok.com/v1/org_field_types/'
  }

  return 'https://mapi.storyblok.com/v1/field_types/'
}
