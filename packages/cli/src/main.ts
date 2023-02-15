/* eslint-disable functional/no-this-expression */
import { create, add, deploy } from './commands'
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
    .option(
      '--dir <value>',
      'directory to create a repository into (default: `.`)',
    )
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
      const { dir, structure, template, name } = this.opts<{
        dir?: string
        structure?: Structure
        template?: Template
        name?: string
      }>()

      await create({ dir, structure, template, packageName: name })
    })

  program
    .command('deploy')
    .description('deploys your selected plugin to Storyblok')
    .option('--name <value>', 'name of plugin to be deployed')
    .option('--token <value>', 'Storyblok personal access token')
    .option('--skipPrompts', 'deploys without prompts', false)
    .action(async function (this: Command) {
      const { name, skipPrompts, token } = this.opts<{
        name?: string
        skipPrompts?: boolean
        token?: string
      }>()
      //TODO: fix typing
      await deploy({
        fieldPluginName: name,
        skipPrompts,
        token,
      } as Parameters<typeof deploy>[0])
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
    .option(
      '--dir <value>',
      'directory to create a field-plugin into (default: `.`)',
    )
    .action(async function (this: Command) {
      const { name, template, dir } = this.opts<{
        name?: string
        template?: string
        dir?: string
      }>()
      await add({ packageName: name, template, dir })
    })

  program.parse(process.argv)
}
