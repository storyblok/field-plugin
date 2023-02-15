import { red } from 'kleur/colors'

export type FieldType = { id: number; name: string; body: string }

export const StoryblokClient = (token: string) => {
  const headers = {
    Authorization: token ?? '',
    'Content-Type': 'application/json',
  }

  const fetchFieldTypes = async (page = 1) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(
      `https://mapi.storyblok.com/v1/field_types/?page=${page}`,
      {
        method: 'GET',
        headers,
      },
    )
    const json = (await response.json()) as {
      error?: string
      field_types: FieldType[]
    }
    handleError(json.error)
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

  type UpdateFieldTypeFunc = (args: {
    id: number
    field_type: Partial<FieldType>
  }) => Promise<boolean>

  const updateFieldType: UpdateFieldTypeFunc = async ({ id, field_type }) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(
      `https://mapi.storyblok.com/v1/field_types/${id}`,
      {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({
          field_type,
        }),
      },
    )
    if (!response.ok) {
      console.log(red('[ERROR]'), 'Failed to update the field-type.')
      console.log(`  > status: ${response.status}`)
      console.log(`  > statusText: ${response.statusText}`)
    }
    return response.ok
  }

  const createFieldType = async (name: string) => {
    const fetch = (await import('node-fetch')).default
    const response = await fetch(`https://mapi.storyblok.com/v1/field_types/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        field_type: {
          name,
        },
      }),
    })
    const json = (await response.json()) as {
      error?: string
      field_type: FieldType
    }
    handleError(json.error)
    return json.field_type
  }

  return {
    fetchAllFieldTypes,
    updateFieldType,
    createFieldType,
  }
}

const handleError = (error?: string) => {
  if (error) {
    if (error === 'Unauthorized') {
      console.log(
        red('[ERROR]'),
        'Token to access Storyblok is undefined or invalid.',
      )
      console.log(
        'Please provide a valid --token option value or STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable',
      )
    } else {
      console.log(red('[ERROR]'), 'Failed to fetch field types.')
      console.log(`  > ${error}`)
    }
    process.exit(1)
  }
}
