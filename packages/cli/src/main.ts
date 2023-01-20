import { generate, TEMPLATES } from './generate'
import { deploy } from './deploy'
import { newProject } from './newProject'
import { Command } from 'commander'

const program = new Command()

export const main = () => {
  program
    .command('new', { isDefault: true })
    .description('creates a new repository to start developing field plugins')
    .action(function () {
      newProject()
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
      await deploy({ fieldPluginName: name, skipPrompts })
    })

  const templateOptions = TEMPLATES.map(
    (template) => `'${template.value}'`,
  ).join(' | ')
  program
    .command('generate')
    .description('generates new field-plugin inside your project')
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
      await generate({ packageName: name, template })
    })

  program.parse(process.argv)
}
