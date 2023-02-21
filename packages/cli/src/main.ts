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

export type Template = 'vue2'
export type Structure = 'single' | 'multiple'

const program = new Command()
const templateOptions = TEMPLATES.map((template) => template.value)
const structureOptions = ['single', 'multiple']

export const main = () => {
  program
    .version(packageJson.version)
    .command('create', { isDefault: true })
    .description('creates a new repository to start developing field plugins')
    .option('--dir <value>', 'directory to create a repository into', '.')
    .option(
      '--name <value>',
      'name of plugin (Lowercase alphanumeric and dash)',
    )
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
    .action(async function (this: Command) {
      const { dir, structure, template, name } = this.opts<CreateArgs>()

      await create({ dir, structure, template, name })
    })

  program
    .command('deploy')
    .description('deploys your selected plugin to Storyblok')
    .option('--token <value>', 'Storyblok personal access token')
    .option('--skipPrompts', 'deploys without prompts', false)
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
        '--chooseFrom <value>',
        'path to where all field plugin are located in a monorepo setup',
      ).conflicts(['dir', 'skipPrompts', 'output']),
    )
    .action(async function (this: Command) {
      const { dir, skipPrompts, token, chooseFrom, output } =
        this.opts<DeployArgs>()

      await deploy({
        skipPrompts,
        token,
        dir,
        chooseFrom,
        output,
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
    .action(async function (this: Command) {
      const { name, template, dir } = this.opts<AddArgs>()

      await add({ name, template, dir })
    })

  program.parse(process.argv)
}
