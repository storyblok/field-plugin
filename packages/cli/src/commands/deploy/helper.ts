import { readFileSync, lstatSync } from 'fs'
import { bold, cyan, green, red, yellow } from 'kleur/colors'
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
import {
  load,
  Manifest,
  MANIFEST_FILE_NAME,
  ManifestOption,
  getErrorMessage,
} from '@storyblok/manifest-helper'

const packageNameMessage =
  'How would you like to call the deployed field-plugin?\n  (Lowercase alphanumeric and dash are allowed.)'

type UpsertFieldPluginFunc = (args: {
  scope: Scope
  token: string
  dir: string
  packageName: string
  output: string
  skipPrompts: undefined | boolean
  publish: boolean
}) => Promise<{ id: number }>

type GetPackageName = (params: {
  name?: string
  skipPrompts: boolean
  dir: string
}) => Promise<{ error: false; name: string } | { error: true }>

// TODO: move all side effects to the deploy function
export const upsertFieldPlugin: UpsertFieldPluginFunc = async (args) => {
  const { packageName, skipPrompts, token, output, dir, scope, publish } = args

  const manifest = loadManifest()

  printManifestOptions(manifest?.options)

  const storyblokClient = StoryblokClient({ token, scope })

  console.log(bold(cyan('[info] Checking existing field plugins...')))

  const scopeFieldPlugins = await storyblokClient.fetchAllFieldTypes()
  const fieldPluginFound = scopeFieldPlugins.find(
    (fieldPlugin) => fieldPlugin.name === packageName,
  )

  if (fieldPluginFound) {
    const mode = skipPrompts ? 'update' : await selectUpsertMode()

    if (mode === 'create') {
      const fieldPlugin = await createFieldPlugin(
        storyblokClient,
        '',
        output,
        manifest?.options,
        dir,
        scopeFieldPlugins,
        skipPrompts,
      )

      return { id: fieldPlugin.id }
    }

    if (!skipPrompts) {
      await confirmOptionsUpdate(manifest?.options)
    }

    const shouldPublish = await checkPublish({ publish, skipPrompts })

    await storyblokClient.updateFieldType({
      id: fieldPluginFound.id,
      publish: shouldPublish,
      field_type: {
        body: output,
        options: manifest?.options,
      },
    })

    return { id: fieldPluginFound.id }
  }

  // create flow
  const create = skipPrompts
    ? true
    : await confirmCreatingFieldPlugin(packageName)

  if (!create) {
    console.log(cyan(bold('[info]')), 'Not creating a new field plugin.')
    process.exit(1)
  }

  const fieldPlugin = await createFieldPlugin(
    storyblokClient,
    packageName,
    output,
    manifest?.options,
    dir,
    scopeFieldPlugins,
    skipPrompts,
  )

  return { id: fieldPlugin.id }
}

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

export const getPackageJsonName = (path: string): string | undefined => {
  if (!lstatSync(path).isDirectory()) {
    return
  }

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

export const confirmUpdatingNameInPackageJson = async () => {
  const { update } = await betterPrompts<{ update: boolean }>({
    type: 'confirm',
    name: 'update',
    message: `Do you update the name in \`package.json\``,
    initial: false,
  })
  return update
}

export const confirmNewName = async (currentName: string) => {
  const { rename } = await betterPrompts<{ rename: boolean }>({
    type: 'confirm',
    name: 'rename',
    message: `The current name '${currentName}' was already taken. Do you want to rename it?`,
    initial: true,
  })
  return rename
}

export const promptNewName = async (scopeFieldPlugins: FieldType[]) => {
  const { name } = await betterPrompts<{ name: string }>({
    type: 'text',
    name: 'name',
    message: 'Enter the new name of the field plugin:',
    validate: (name: string) => {
      if (!isValidPackageName(name)) {
        return false
      }

      return scopeFieldPlugins.every((plugin) => plugin.name !== name)
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

export const printManifestOptions = (options: ManifestOption[] | undefined) => {
  if (options?.length === 0 || options === undefined) {
    return
  }

  const concatenatedOptions =
    options !== undefined
      ? options?.map((option) => option.name).join(', ')
      : ''

  console.log(cyan(bold('[info] Options found:')), green(concatenatedOptions))

  console.log(
    yellow(
      bold(
        `[info] Please note that the option values will not be shared when this field plugin is added to a story. Only keys are configured for security reasons.\n` +
          `[info] Learn more: https://www.storyblok.com/docs/plugins/field-plugins/storyblok-field-plugin#manifest-file-for-field-plugins`,
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
    console.log(`path: ${MANIFEST_FILE_NAME}`)
    console.log(red(`${bold('[ERROR]:')} ${getErrorMessage(err)}`))
    return undefined
  }
}

export const createFieldPlugin = async (
  client: StoryClientType,
  packageName: string,
  content: string,
  options: ManifestOption[] | undefined,
  dir: string,
  scopeFieldPlugins: FieldType[],
  skipPrompts?: boolean,
): Promise<FieldType> => {
  const name =
    packageName !== '' ? packageName : await promptNewName(scopeFieldPlugins)

  try {
    const fieldPlugin = await client.createFieldType({
      name,
      body: content,
    })

    //since `options` and `publish` properties are only accepted during updates,
    //we need to force an update call right after the creation.
    //If no options is found, it's not going to be sent to the API since undefined
    //properties are not encoded.
    //NOTE: The `publish` property is set to true here because it is a part of the creation process and should provide a consistent flow.
    await client.updateFieldType({
      id: fieldPlugin.id,
      publish: true,
      field_type: {
        options,
      },
    })

    if (!packageName && (await confirmUpdatingNameInPackageJson())) {
      await runCommand(`npm pkg set name=${name}`, { cwd: dir })
    }

    return fieldPlugin
  } catch (err) {
    if (skipPrompts || getErrorMessage(err) !== 'DUPLICATED_NAME') {
      throw err
    }

    const isRenamingConfirmed = await confirmNewName(name)

    if (!isRenamingConfirmed) {
      console.log(cyan(bold('[info]')), 'Aborting the deployment')
      process.exit(1)
    }

    return await createFieldPlugin(
      client,
      '',
      content,
      options,
      dir,
      scopeFieldPlugins,
      skipPrompts,
    )
  }
}

// Publish Logic

type CheckPublish = (params: {
  publish: boolean
  skipPrompts: undefined | boolean
}) => Promise<boolean>

export const checkPublish: CheckPublish = async ({ publish, skipPrompts }) => {
  if (skipPrompts === true || publish === false) {
    return publish
  }

  //NOTE: In interactive mode where --no-publish is not provided, the user is asked to confirm the publish action.
  const publishConfirmation = await confirmPublish()
  return publishConfirmation
}

const confirmPublish = async (): Promise<boolean> => {
  const { publish } = await betterPrompts<{
    publish: boolean
  }>({
    type: 'confirm',
    name: 'publish',
    message: 'Do you want to publish a new version of the field plugin?',
    initial: false,
  })

  return publish
}
