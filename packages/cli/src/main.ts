import { generate, TEMPLATES } from './generate';
import { deploy, DeployArgs } from './deploy';
import { Command } from 'commander';
import { red } from 'kleur/colors';

const program = new Command();

export function validateDeployOptions({
  fieldPluginName,
  skipPrompts,
}: DeployArgs) {
  if (skipPrompts && !fieldPluginName) {
    console.log(red('[ERROR]'), 'Cannot skip prompts without name.\n');
    console.log('Use --name option to define a plugin name!');
    process.exit(1);
  }
}

async function main() {
  program
    .command('deploy')
    .description('deploys your selected plugin to Storyblok')
    .option('--name <value>', 'name of plugin to be deployed')
    .option('--skipPrompts', 'deploys without prompts', false)
    .action(async function () {
      const { name, skipPrompts } = this.opts();
      validateDeployOptions({ fieldPluginName: name, skipPrompts });
      await deploy({ fieldPluginName: name, skipPrompts });
    });

  const templateOptions = TEMPLATES.map(
    (template) => `'${template.value}'`
  ).join(' | ');
  program
    .command('generate')
    .description('generates new field-plugin inside your project')
    .option(
      '--template <value>',
      `name of template to use (${templateOptions})`
    )
    .option(
      '--name <value>',
      'name of plugin (Lowercase alphanumeric and dash)'
    )
    .action(async function () {
      const { name, template } = this.opts();
      await generate({ packageName: name, template });
    });

  program.parse(process.argv);
}

if (process.env.NODE_ENV !== 'test') {
  main();
}
