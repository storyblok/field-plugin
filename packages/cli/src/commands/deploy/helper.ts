import { readFileSync, lstatSync } from 'fs'
import { bold, cyan } from 'kleur/colors'
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
  StoryblokClient,
} from '../../storyblok/storyblok-client'

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

  const storyblokClient = StoryblokClient({ token, scope })

  console.log(bold(cyan('[info] Checking existing field plugins...')))
  const allFieldPlugins = await storyblokClient.fetchAllFieldTypes()
  const fieldPlugin = allFieldPlugins.find(
    (fieldPlugin) => fieldPlugin.name === packageName,
  )

  if (fieldPlugin) {
    // update flow
    const mode = skipPrompts ? 'update' : await selectUpsertMode()
    if (mode === 'update') {
      await storyblokClient.updateFieldType({
        id: fieldPlugin.id,
        field_type: {
          body: output,
        },
      })
      return { id: fieldPlugin.id }
    } else if (mode === 'create') {
      const newName = await promptNewName(allFieldPlugins)
      const newFieldPlugin = await storyblokClient.createFieldType({
        name: newName,
        body: output,
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
  const newFieldPlugin = await storyblokClient.createFieldType({
    name: packageName,
    body: output,
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
