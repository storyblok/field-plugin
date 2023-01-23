import { red } from 'kleur/colors';
import { loadEnvironmentVariables } from '../utils';

export type FieldType = { id: number; name: string; body: string };

const getDefaultHeaders = () => {
  loadEnvironmentVariables();

  return {
    Authorization: process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN ?? '',
    'Content-Type': 'application/json',
  };
};

const handleError = (error?: string) => {
  if (error) {
    if (error === 'Unauthorized') {
      console.log(
        red('[ERROR]'),
        'The environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN` is missing or wrong.',
      );
      console.log(
        'Create .env file at the root of this repository and configure the variable.',
      );
    } else {
      console.log(red('[ERROR]'), 'Failed to fetch field types.');
      console.log(`  > ${error}`);
    }
    process.exit(1);
  }
};

export const fetchFieldTypes = async (page = 1) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    `https://mapi.storyblok.com/v1/field_types/?page=${page}`,
    {
      method: 'GET',
      headers: getDefaultHeaders(),
    },
  );
  const json = (await response.json()) as {
    error?: string;
    field_types: FieldType[];
  };
  handleError(json.error);
  return json.field_types;
};

export const fetchAllFieldTypes = async () => {
  const results: FieldType[] = [];

  // eslint-disable-next-line functional/no-loop-statement, functional/no-let
  for (let page = 1; page <= 100; page++) {
    const fieldTypes = await fetchFieldTypes(page);
    if (fieldTypes.length === 0) {
      break;
    }
    // eslint-disable-next-line functional/immutable-data
    results.push(...fieldTypes);
  }
  return results;
};

type UpdateFieldTypeFunc = (args: {
  id: number;
  field_type: Partial<FieldType>;
}) => Promise<boolean>;

export const updateFieldType: UpdateFieldTypeFunc = async ({
  id,
  field_type,
}) => {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(
    `https://mapi.storyblok.com/v1/field_types/${id}`,
    {
      method: 'PUT',
      headers: getDefaultHeaders(),
      body: JSON.stringify({
        field_type,
      }),
    },
  );
  if (!response.ok) {
    console.log(red('[ERROR]'), 'Failed to update the field-type.');
    console.log(`  > status: ${response.status}`);
    console.log(`  > statusText: ${response.statusText}`);
  }
  return response.ok;
};

export const createFieldType = async (name: string) => {
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
  const json = (await response.json()) as {
    error?: string;
    field_type: FieldType;
  };
  handleError(json.error);
  return json.field_type;
};
