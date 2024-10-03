import { existsSync, readFileSync } from 'fs'
import { bold, cyan, red, green } from 'kleur/colors'
import { resolve } from 'path'
import {
  createDefaultOutputPath,
  getDeployBaseUrl,
  getPackageName,
  isOutputValid,
  selectApiScope,
  upsertFieldPlugin,
} from './helper'
import { getPersonalAccessToken } from '../../utils'
import { Scope } from '../../storyblok/storyblok-client'

export type DeployArgs = {
  skipPrompts: boolean
  dir: string
  publish: boolean
  name: undefined | string
  token: undefined | string
  output: undefined | string
  dotEnvPath: undefined | string
  scope: undefined | Scope
}

type DeployFunc = (args: DeployArgs) => Promise<void>

export const deploy: DeployFunc = async (params) => {
  const { skipPrompts, token, name, dir, output, publish, dotEnvPath, scope } =
    params

  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's deploy a field-plugin.\n")

  //TODO: rewrite to include error for each case
  // NOTE: moving this upward as an early escape
  if (skipPrompts && !scope) {
    console.error(
      red('[ERROR]'),
      'Please provide a value for the --scope flag when using --skipPrompts.',
    )
    process.exit(1)
  }

  const personalAccessTokenResult = await getPersonalAccessToken({
    token,
    dotEnvPath,
    skipPrompts,
  })

  if (personalAccessTokenResult.error === true) {
    console.error(red('[ERROR]'), personalAccessTokenResult.message)
    console.error(
      'Please provide a valid --token option value or STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable',
    )
    process.exit(1)
  }

  //TODO: test
  const apiScope =
    scope || (await selectApiScope(personalAccessTokenResult.token))

  if (apiScope === undefined) {
    console.error(
      red('[ERROR]'),
      `The token appears to be invalid as it does not have access to either My Plugins, the plugins on the Partner Portal or the Organization plugins.`,
    )
    process.exit(1)
  }

  const packageNameResult = await getPackageName({ name, skipPrompts, dir })

  //TODO: move this check to getPackageName
  if (
    packageNameResult.error === true ||
    typeof packageNameResult.name !== 'string' ||
    packageNameResult.name === ''
  ) {
    console.error(red('[ERROR]'), 'The package name is missing')
    console.error(
      'Use `--name <package-name>` or `--dir <path-to-package>` to specify the package name.',
    )
    process.exit(1)
  }

  console.log(bold(cyan(`[info] Plugin name: \`${packageNameResult.name}\``)))
  // path of the specific field-plugin package
  const outputPath = isOutputValid(output)
    ? resolve(output)
    : createDefaultOutputPath(dir)

  if (!existsSync(outputPath)) {
    console.log(red('[ERROR]'), 'Could not find a bundle at:')
    console.log(`  > ${outputPath}`)
    console.log('')
    console.log(
      `Please build the project before running the deployment command. If the bundle is located somewhere else, please use the \`--output\` option.`,
    )
    process.exit(1)
  }

  const outputFile = readFileSync(outputPath).toString()

  const { id: fieldPluginId } = await upsertFieldPlugin({
    dir,
    packageName: packageNameResult.name,
    skipPrompts,
    token: personalAccessTokenResult.token,
    output: outputFile,
    scope: apiScope,
    publish,
  })

  console.log(
    bold(green('[SUCCESS]')),
    'The field plugin is deployed successfully.',
  )
  console.log('You can find the deployed plugin at the following URL:')
  console.log(`  > ${getDeployBaseUrl(apiScope)}/${fieldPluginId}`)
  console.log(
    'You can also find it in "My account > My Plugins" at the bottom of the sidebar.',
  )
}
