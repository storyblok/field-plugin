import { add, TEMPLATES } from './add'
import { deploy, type DeployArgs } from './deploy'
import { create } from './create'
import { Command } from 'commander'

const program = new Command()

export const main = () => {
  program
    .command('create', { isDefault: true })
    .description('creates a new repository to start developing field plugins')
    .action(function () {
      create()
    })

  program
    .command('deploy')
    .description('deploys your selected plugin to Storyblok')
    .option('--name <value>', 'name of plugin to be deployed')
    .option('--skipPrompts', 'deploys without prompts', false)
    .action(async function (this: Command) {
      // eslint-disable-next-line functional/no-this-expression
      const { name, skipPrompts } = this.opts<{
        name?: string
        skipPrompts?: boolean
      }>()
      await deploy({ fieldPluginName: name, skipPrompts } as DeployArgs)
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
    .action(async function (this: Command) {
      // eslint-disable-next-line functional/no-this-expression
      const { name, template } = this.opts<{
        name?: string
        template?: string
      }>()
      await add({ packageName: name, template })
    })

  program.parse(process.argv)
}
