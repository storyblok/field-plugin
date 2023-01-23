import { red } from 'kleur/colors';
import { loadEnvironmentVariables } from '../utils';

type FieldType = { id: number; name: string; body: string };

function getDefaultHeaders() {
  loadEnvironmentVariables();

  return {
    Authorization: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN!,
    'Content-Type': 'application/json',
  };
}

function handleError(error: any) {
  if (error) {
    if (error === 'Unauthorized') {
      console.log(
        red('[ERROR]'),
        'The environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` is missing or wrong.'
      );
      console.log(
        'Create .env file at the root of this repository and configure the variable.'
      );
    } else {
      console.log(red('[ERROR]'), 'Failed to fetch field types.');
      console.log(`  > ${error}`);
    }
    process.exit(1);
  }
}

export async function fetchFieldTypes(page: number = 1) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    `https://mapi.storyblok.com/v1/field_types/?page=${page}`,
    {
      method: 'GET',
      headers: getDefaultHeaders(),
    }
  );
  const json: any = await response.json();
  handleError(json.error);
  return json.field_types as FieldType[];
}

export async function fetchAllFieldTypes() {
  const results: FieldType[] = [];
  for (let page = 1; page <= 100; page++) {
    const fieldTypes = await fetchFieldTypes(page);
    if (fieldTypes.length === 0) {
      break;
    }
    results.push(...fieldTypes);
  }
  return results;
}

export async function updateFieldType({
  id,
  field_type,
}: {
  id: number;
  field_type: Partial<FieldType>;
}) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    `https://mapi.storyblok.com/v1/field_types/${id}`,
    {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        field_type,
      }),
    }
  );
  if (!response.ok) {
    console.log(red('[ERROR]'), 'Failed to update the field-type.');
    console.log(`  > status: ${response.status}`);
    console.log(`  > statusText: ${response.statusText}`);
  }
  return response.ok;
}

export async function createFieldType(name: string) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`https://mapi.storyblok.com/v1/field_types/`, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify({
      field_type: {
        name,
      },
    }),
  });
  const json: any = await response.json();
  handleError(json.error);
  return json.field_type as FieldType;
}
