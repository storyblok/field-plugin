/* eslint-disable functional/no-this-expression */
import {
  create,
  add,
  deploy,
  DeployArgs,
  AddArgs,
  CreateArgs,
} from './commands'
import { TEMPLATES } from '../config'
import { Command, Option } from 'commander'
import packageJson from './../package.json'

const program = new Command()
const templateOptions = TEMPLATES.map((template) => template.value)
const structureOptions = ['standalone', 'monorepo']
const packageManagerOptions = ['npm', 'yarn', 'pnpm']
const deployScopeOptions = ['my-plugins', 'partner-portal', 'organization']

export const main = () => {
  program
    .version(packageJson.version)
    .command('create', { isDefault: true })
    .description('creates a new repository to start developing field plugins')
    .option('--dir <value>', 'directory to create a repository into', '.')
    .addOption(
      new Option('--template <value>', 'name of template to use').choices(
        templateOptions,
      ),
    )
    .addOption(
      new Option('--structure <value>', 'setup structure').choices(
        structureOptions,
      ),
    )
    .addOption(
      new Option('--packageManager <value>', 'package manager').choices(
        packageManagerOptions,
      ),
    )
    .option(
      '--pluginName <value>',
      'name of plugin (Lowercase alphanumeric and dash)',
    )
    .option(
      '--repoName <value>',
      '[Monorepo] name of repository (Lowercase alphanumeric and dash)',
    )
    .action(async function(this: Command) {
      await create(this.opts<CreateArgs>())
    })

  program
    .command('deploy')
    .description('deploys your selected plugin to Storyblok')
    .option('--token <value>', 'Storyblok personal access token')
    .option('--skipPrompts', 'deploys without prompts', false)
    .option(
      '--name <value>',
      'name of plugin (Lowercase alphanumeric and dash)',
    )
    .addOption(
      new Option(
        '--output <value>',
        'location of the built output file (default: `./dist/index.js`)',
      ),
    )
    .addOption(
      new Option(
        '--dir <value>',
        `path to the field plugin's \`package.json\` directory`,
      ).default('.'),
    )
    .addOption(
      new Option(
        '--dotEnvPath <value>',
        'path to the `.env` file which stores the environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`',
      ),
    )
    .addOption(
      new Option(
        '--scope <value>',
        `where to deploy the field plugin ('my-plugins' | 'partner-portal' | 'organization')`,
      ).choices(deployScopeOptions),
    )
    .action(async function(this: Command) {
      await deploy(this.opts<DeployArgs>())
    })

  program
    .command('add')
    .description('adds new field-plugin inside your project')
    .addOption(
      new Option('--template <value>', 'name of template to use').choices(
        templateOptions,
      ),
    )
    .option(
      '--name <value>',
      'name of plugin (Lowercase alphanumeric and dash)',
    )
    .option('--dir <value>', 'directory to create a field-plugin into', '.')
    .addOption(
      new Option('--structure <value>', 'setup structure').choices(
        structureOptions,
      ),
    )
    .addOption(
      new Option('--packageManager <value>', 'package manager').choices(
        packageManagerOptions,
      ),
    )
    .action(async function(this: Command) {
      await add(this.opts<AddArgs>())
    })

  program.parse(process.argv)
}
