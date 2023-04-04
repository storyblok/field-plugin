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
const structureOptions = ['polyrepo', 'monorepo']

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
      await create(opts)
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
        'defines location of the built output file',
      ),
    )
    .addOption(
      new Option(
        '--dir <value>',
        'path to field plugin to be deployed',
      ).default('.'),
    )
    .addOption(
      new Option(
        '--dotEnvPath <value>',
        'path to the `.env` file which stores the environment variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`',
      ),
    )
    .action(async function (this: Command) {
      const { dir, skipPrompts, token, output, dotEnvPath } =
        this.opts<DeployArgs>()

      await deploy({
        skipPrompts,
        token,
        dir,
        output,
        dotEnvPath,
      })
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
    .action(async function (this: Command) {
      const { name, template, dir, structure } = this.opts<AddArgs>()

      await add({ name, template, dir, structure })
    })

  program.parse(process.argv)
}
