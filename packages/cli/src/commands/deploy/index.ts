import { existsSync, readFileSync } from 'fs'
import { bold, cyan, red, green } from 'kleur/colors'
import { resolve } from 'path'
import { decidePackageName, selectApiScope, upsertFieldPlugin } from './helper'
import { getPersonalAccessToken } from '../../utils'
import { Scope } from '../../storyblok/storyblok-client'

export type DeployArgs = {
  skipPrompts: boolean
  dir: string
  name: undefined | string
  token: undefined | string
  output: undefined | string
  dotEnvPath: undefined | string
  scope: undefined | Scope
}

type DeployFunc = (args: DeployArgs) => Promise<void>

export const deploy: DeployFunc = async ({
  skipPrompts,
  token,
  name,
  dir,
  output,
  dotEnvPath,
  scope,
}) => {
  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's deploy a field-plugin.\n")

  const result = await getPersonalAccessToken({ token, dotEnvPath })
  if (result.error === true) {
    console.error(red('[ERROR]'), result.message)
    console.error(
      'Please provide a valid --token option value or STORYBLOK_PERSONAL_ACCESS_TOKEN as an environmental variable',
    )
    process.exit(1)
  }

  const packageNameResult = await decidePackageName({ name, skipPrompts, dir })

  if (
    packageNameResult.error === true ||
    typeof packageNameResult.packageName !== 'string' ||
    packageNameResult.packageName === ''
  ) {
    console.error(red('[ERROR]'), 'The package name is missing')
    console.error(
      'Use `--name <package-name>` or `--dir <path-to-package>` to specify the package name.',
    )
    process.exit(1)
  }

  if (!scope && skipPrompts) {
    console.error(
      red('[ERROR]'),
      'Please provide a value for the --scope flag when using --skipPrompts.',
    )
    process.exit(1)
  }
  const apiScope = scope || (await selectApiScope(result.token))

  console.log(
    bold(cyan(`[info] Plugin name: \`${packageNameResult.packageName}\``)),
  )

  // path of the specific field-plugin package
  const defaultOutputPath = resolve(dir, 'dist', 'index.js')
  const outputPath =
    typeof output !== 'undefined' ? resolve(output) : defaultOutputPath

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
    packageName: packageNameResult.packageName,
    skipPrompts,
    token: result.token,
    output: outputFile,
    scope: apiScope,
  })

  console.log(
    bold(green('[SUCCESS]')),
    'The field plugin is deployed successfully.',
  )

  console.log('You can find the deployed plugin at the following URL:')
  if (apiScope === 'partner-portal') {
    console.log(
      `  > https://app.storyblok.com/#/partner/fields/${fieldPluginId}`,
    )
  }

  if (apiScope === 'my-plugins') {
    console.log(`  > https://app.storyblok.com/#/me/plugins/${fieldPluginId}`)
  }

  if (apiScope === 'organization') {
    console.log(
      `  > https://app.storyblok.com/#/me/org/fields/${fieldPluginId}`,
    )
  }

  console.log(
    'You can also find it in "My account > My Plugins" at the bottom of the sidebar.',
  )
}
