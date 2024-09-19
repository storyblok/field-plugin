import { Scope } from '../../storyblok/storyblok-client'
import { bold, cyan, green, red } from 'kleur/colors'
import { getPersonalAccessToken } from '../../utils'
import { getPackageName, selectApiScope } from '../deploy/helper'

export type RemoveArgs = {
  skipPrompts: boolean
  dir: string
  name: undefined | string
  token: undefined | string
  output: undefined | string
  dotEnvPath: undefined | string
  scope: undefined | Scope
}

type RemoveFunc = (args: RemoveArgs) => Promise<void>

/** TODOs:
 * Extract code
 * Create function to delete field plugin
 * Loading spinner
 */
export const remove: RemoveFunc = async (params) => {
  const { skipPrompts, token, name, dir, output, dotEnvPath, scope } = params

  console.log(bold(cyan('\nWelcome!')))

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
  console.log(bold(cyan(`[info] Deleting plugin from storyblok...`)))

  // const { id: fieldPluginId } = await upsertFieldPlugin({
  //   dir,
  //   packageName: packageNameResult.name,
  //   skipPrompts,
  //   token: personalAccessTokenResult.token,
  //   output: outputFile,
  //   scope: apiScope,
  // })

  console.log(
    bold(green('[SUCCESS]')),
    'The field plugin was successfully removed',
  )

  return
}
