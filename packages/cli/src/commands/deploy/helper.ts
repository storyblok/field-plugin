import { readFileSync, lstatSync } from 'fs'
import {
  bold,
  cyan,
  gray,
  green,
  grey,
  red,
  underline,
  yellow,
} from 'kleur/colors'
import { resolve } from 'path'
import { type Choice } from 'prompts'
import {
  betterPrompts,
  isValidPackageName,
  promptName,
  runCommand,
} from '../../utils'
import {
  FieldType,
  Scope,
  StoryClientType,
  StoryblokClient,
} from '../../storyblok/storyblok-client'
import { getErrorMessage } from '@storyblok/manifest-helper/src/utils'
import {
  load,
  Manifest,
  MANIFEST_FILE_NAME,
  ManifestOption,
} from '@storyblok/manifest-helper/src/manifest'

const packageNameMessage =
  'How would you like to call the deployed field-plugin?\n  (Lowercase alphanumeric and dash are allowed.)'

type UpsertFieldPluginFunc = (args: {
  dir: string
  packageName: string
  skipPrompts?: boolean
  token: string
  output: string
  scope: Scope
}) => Promise<{ id: number }>

type GetPackageName = (params: {
  name?: string
  skipPrompts: boolean
  dir: string
}) => Promise<{ error: false; name: string } | { error: true }>

type CreateFieldTypeFunc = (params: {
  name: string
  body: unknown
  client: StoryClientType
  options: ManifestOption[] | undefined
}) => Promise<FieldType>

export const getPackageName: GetPackageName = async ({
  name,
  skipPrompts,
  dir,
}) => {
  if (typeof name === 'string' && name !== '') {
    return { error: false, name }
  }

  const packageJsonName = getPackageJsonName(dir)

  if (skipPrompts === false) {
    const nameFromPrompt = await promptName({
      message: packageNameMessage,
      initialValue: packageJsonName,
    })

    return {
      error: false,
      name: nameFromPrompt,
    }
  }

  if (isValidPackageName(packageJsonName)) {
    return { error: false, name: packageJsonName }
  }

  return { error: true }
}

// TODO: move all side effects to the deploy function
export const upsertFieldPlugin: UpsertFieldPluginFunc = async (args) => {
  const { packageName, skipPrompts, token, output, dir, scope } = args

  const manifest = loadManifest()

  const storyblokClient = StoryblokClient({ token, scope })

  lookForManifestOptions(manifest?.options)

  console.log(bold(cyan('[info] Checking existing field plugins...')))

  const allFieldPlugins = await storyblokClient.fetchAllFieldTypes()
  const fieldPlugin = allFieldPlugins.find(
    (fieldPlugin) => fieldPlugin.name === packageName,
  )

  if (fieldPlugin) {
    // update flow
    const mode = skipPrompts ? 'update' : await selectUpsertMode()

    if (mode === 'update') {
      if (!skipPrompts) {
        await confirmOptionsUpdate(manifest?.options)
      }

      await storyblokClient.updateFieldType({
        id: fieldPlugin.id,
        publish: true,
        field_type: {
          body: output,
          options: manifest?.options,
        },
      })

      return { id: fieldPlugin.id }
    } else if (mode === 'create') {
      const newName = await promptNewName(allFieldPlugins)

      const newFieldPlugin = await createFieldType({
        name: newName,
        body: output,
        client: storyblokClient,
        options: manifest?.options,
      })

      if (await confirmUpdatingName()) {
        await runCommand(`npm pkg set name=${newName}`, { cwd: dir })
      }

      return { id: newFieldPlugin.id }
    }
  }

  // create flow
  const create = skipPrompts
    ? true
    : await confirmCreatingFieldPlugin(packageName)
  if (!create) {
    console.log(cyan(bold('[info]')), 'Not creating a new field plugin.')
    process.exit(1)
  }

  const newFieldPlugin = await createFieldType({
    name: packageName,
    body: output,
    client: storyblokClient,
    options: manifest?.options,
  })

  return { id: newFieldPlugin.id }
}

export const getPackageJsonName = (path: string): string | undefined => {
  if (!lstatSync(path).isDirectory()) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json: { name: string } = JSON.parse(
    readFileSync(resolve(path, 'package.json')).toString(),
  )

  if (!json.name) {
    return
  }

  return json.name
}

export const selectUpsertMode = async () => {
  const { mode } = await betterPrompts<{ mode: 'update' | 'create' }>([
    {
      type: 'select',
      name: 'mode',
      message: 'Update the existing field plugin?',
      choices: [
        {
          title: 'Yes, update it.',
          value: 'update',
        },
        {
          title: 'No, create a new one.',
          value: 'create',
        },
      ],
    },
  ])

  return mode
}

export const confirmCreatingFieldPlugin = async (name: string) => {
  const { create } = await betterPrompts<{ create: boolean }>({
    type: 'confirm',
    name: 'create',
    message: `You want to deploy a new field plugin \`${name}\`?`,
    initial: true,
  })
  return create
}

export const confirmUpdatingName = async () => {
  const { update } = await betterPrompts<{ update: boolean }>({
    type: 'confirm',
    name: 'update',
    message: `Do you update the name in \`package.json\``,
    initial: false,
  })
  return update
}

export const promptNewName = async (allFieldPlugins: FieldType[]) => {
  const { name } = await betterPrompts<{ name: string }>({
    type: 'text',
    name: 'name',
    message: 'Enter the new name of the field plugin:',
    validate: (name: string) => {
      if (!isValidPackageName(name)) {
        return false
      }
      return allFieldPlugins.every((plugin) => plugin.name !== name)
    },
  })
  return name
}

export const confirmOptionsUpdate = async (
  options: ManifestOption[] | undefined,
) => {
  if (options === undefined) {
    return
  }

  const message =
    options.length === 0
      ? 'The plugin options will be reset because your manifest file contains an empty array for options. Do you want to proceed?'
      : `The options found in your manifest file are going to replace the plugin options. Do you want to proceed?`

  const { confirmed } = await betterPrompts<{
    confirmed: boolean
  }>({
    type: 'confirm',
    name: 'confirmed',
    message: message,
    initial: true,
  })

  if (!confirmed) {
    console.log(cyan(bold('[info]')), 'Aborting plugin update.')
    process.exit(1)
  }
}

export const lookForManifestOptions = (
  options: ManifestOption[] | undefined,
) => {
  if (options?.length === 0) {
    return
  }

  const concatenatedOptions =
    options !== undefined
      ? options?.map((option) => option.name).join(', ')
      : ''

  console.log(cyan(bold('[info] Options found:')), green(concatenatedOptions))

  console.log(
    grey(
      bold(
        `[info] Please note that the option values won't be shared with a real Field but they'll be available only inside the Field Plugin Editor`,
      ),
    ),
  )
}

export const selectApiScope = async (
  token: string,
): Promise<Scope | undefined> => {
  const accessibleToMyPlugins = await StoryblokClient({
    token,
    scope: 'my-plugins',
  }).isAuthenticated()

  const accessibleToPartnerPortal = await StoryblokClient({
    token,
    scope: 'partner-portal',
  }).isAuthenticated()

  const accessibleToOrganizationPortal = await StoryblokClient({
    token,
    scope: 'organization',
  }).isAuthenticated()

  if (
    !accessibleToMyPlugins &&
    !accessibleToPartnerPortal &&
    !accessibleToOrganizationPortal
  ) {
    return undefined
  }

  const { scope } = await betterPrompts<{ scope: Scope }>([
    {
      type: 'select',
      name: 'scope',
      message: 'Where to deploy the plugin?',
      choices: [
        accessibleToMyPlugins && {
          title: 'My Plugins',
          value: 'my-plugins',
        },
        accessibleToPartnerPortal && {
          title: 'Partner Portal',
          value: 'partner-portal',
        },
        accessibleToOrganizationPortal && {
          title: 'Organization',
          value: 'organization',
        },
      ].filter(Boolean) as Choice[],
    },
  ])

  return scope
}

export const getDeployBaseUrl = (scope: Scope): string => {
  if (scope === 'organization') {
    return 'https://app.storyblok.com/#/me/org/fields'
  }
  if (scope === 'partner-portal') {
    return 'https://app.storyblok.com/#/partner/fields'
  }

  return 'https://app.storyblok.com/#/me/plugins'
}

export const createDefaultOutputPath = (dir: string) =>
  resolve(dir, 'dist', 'index.js')

export const isOutputValid = (output?: string): output is string =>
  typeof output === 'string' && output !== ''

export const loadManifest = (): Manifest | undefined => {
  try {
    console.log(bold(cyan('[info] Looking for a manifest file...')))

    return load()
  } catch (err) {
    console.log(bold(red('[ERROR]')), `Error while loading the manifest file`)
    console.log(`path: ${MANIFEST_FILE_NAME}`)
    console.log(`error: ${getErrorMessage(err)}`)

    return undefined
  }
}

export const createFieldType: CreateFieldTypeFunc = async ({
  name,
  body,
  client,
  options,
}) => {
  const newFieldPlugin = await client.createFieldType({ name, body })

  //since `options` and `publish` properties are only accepted during updates,
  //we need to force an update call right after the creation.
  //If no options is found, it's not going to be sent to the API since undefined
  //properties are not encoded.
  await client.updateFieldType({
    id: newFieldPlugin.id,
    publish: true,
    field_type: {
      options,
    },
  })

  return newFieldPlugin
}
