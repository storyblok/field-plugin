/* eslint-disable functional/no-this-expression */
import { create, add, deploy } from './commands'
import { TEMPLATES } from '../config'
import { Command } from 'commander'

const program = new Command()

export const main = () => {
  program
    .command('create', { isDefault: true })
    .description('creates a new repository to start developing field plugins')
    .option(
      '--dir <value>',
      'directory to create a repository into (default: `.`)',
    )
    .action(async function (this: Command) {
      const { dir } = this.opts<{ dir?: string }>()
      await create({ dir })
    })

  program
    .command('deploy')
    .description('deploys your selected plugin to Storyblok')
    .option('--name <value>', 'name of plugin to be deployed')
    .option('--skipPrompts', 'deploys without prompts', false)
    .action(async function (this: Command) {
      const { name, skipPrompts } = this.opts<{
        name?: string
        skipPrompts?: boolean
      }>()
      await deploy({ fieldPluginName: name, skipPrompts } as Parameters<
        typeof deploy
      >[0])
    })

  const templateOptions = TEMPLATES.map(
    (template) => `'${template.value}'`,
  ).join(' | ')
  program
    .command('add')
    .description('adds new field-plugin inside your project')
    .option(
      '--template <value>',
      `name of template to use (${templateOptions})`,
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
