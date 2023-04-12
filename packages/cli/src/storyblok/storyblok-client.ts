import { red } from 'kleur/colors'
import type { Response } from 'node-fetch'

const PARTNER_FIELD_TYPES_API_ENDPOINT =
  'https://mapi.storyblok.com/v1/partner_field_types/'

export type FieldType = { id: number; name: string; body: string }

type CreateFieldTypeFunc = (body: {
  name: string
  body?: unknown
}) => Promise<FieldType>

type UpdateFieldTypeFunc = (args: {
  id: number
  field_type: Partial<FieldType>
}) => Promise<void>

type FetchAllFieldTypesFunc = (page?: number) => Promise<FieldType[]>

type FieldPluginResponse = {
  error?: string
  field_type: FieldType
}

type StoryblokClientFunc = (token: string) => {
  fetchAllFieldTypes: FetchAllFieldTypesFunc
  createFieldType: CreateFieldTypeFunc
  updateFieldType: UpdateFieldTypeFunc
}

export const StoryblokClient: StoryblokClientFunc = (token) => {
  const headers = {
    Authorization: token ?? '',
    'Content-Type': 'application/json',
  }

  const fetchFieldTypes: FetchAllFieldTypesFunc = async (page = 1) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(
      `${PARTNER_FIELD_TYPES_API_ENDPOINT}?page=${page}`,
      {
        method: 'GET',
        headers,
      },
    )
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

  const updateFieldType: UpdateFieldTypeFunc = async ({ id, field_type }) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`${PARTNER_FIELD_TYPES_API_ENDPOINT}${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        field_type,
      }),
    })
    const json = (await response.json()) as FieldPluginResponse
    handleErrorIfExists(response, json)
  }

  const createFieldType: CreateFieldTypeFunc = async (body) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`${PARTNER_FIELD_TYPES_API_ENDPOINT}`, {
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
