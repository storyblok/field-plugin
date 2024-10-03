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
import { expandTilde } from './utils'

const templateOptions = TEMPLATES.map((template) => template.value)
const structureOptions = ['standalone', 'monorepo']
const packageManagerOptions = ['npm', 'yarn', 'pnpm']
const deployScopeOptions = ['my-plugins', 'partner-portal', 'organization']

export const createCLI = () => {
  const program = new Command()
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
    .action(async function (this: Command) {
      const opts = this.opts<CreateArgs>()
      await create({ ...opts, dir: expandTilde(opts.dir) })
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
    .option(
      '--no-publish',
      'This flag is only applied when a plugin is being updated! Uploads field plugin but does not publish a new version.',
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
    .action(async function (this: Command) {
      const opts = this.opts<DeployArgs>()
      await deploy({ ...opts, dir: expandTilde(opts.dir) })
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
    .action(async function (this: Command) {
      const opts = this.opts<AddArgs>()
      await add({ ...opts, dir: expandTilde(opts.dir) })
    })

  return program
}

export const main = () => {
  const program = createCLI()
  program.parse(process.argv)
}
