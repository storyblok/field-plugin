import { bold, cyan, red, green } from 'kleur/colors'
import prompts from 'prompts'
import { resolve, dirname } from 'path'
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import Mustache from 'mustache'
import walk from 'walkdir'
import { TEMPLATES, TEMPLATES_PATH } from '../../config'
import { promptName, runCommand } from '../utils'
import { Structure } from '../main'

export type AddArgs = {
  dir: string
  name?: string
  template?: string
  structure?: Structure
}

export type AddFunc = (args: AddArgs) => Promise<{ destPath: string }>

const selectTemplate = async () => {
  const { template } = (await prompts(
    [
      {
        type: 'select',
        name: 'template',
        message: 'Which template?',
        choices: TEMPLATES,
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { template: string }
  return template
}

export const add: AddFunc = async (args) => {
  console.log(bold(cyan('\nWelcome!')))
  console.log("Let's create a field-type extension.\n")

  const packageName =
    typeof args.name !== 'undefined' && args.name !== ''
      ? args.name
      : await promptName({
          message:
            'What is your package name?\n  (Lowercase alphanumeric and dash are allowed.)',
        })

  const template =
    typeof args.template !== 'undefined'
      ? args.template
      : await selectTemplate()
  const rootPath = resolve(args.dir)
  const destPath = resolve(rootPath, packageName)
  const templatePath = resolve(TEMPLATES_PATH, template) + '/'

  if (!existsSync(templatePath)) {
    console.log(
      bold(red('[ERROR]')),
      `The template '${template}' is not found.`,
    )
    process.exit(1)
  }

  walk.sync(templatePath, (file, stat) => {
    if (!stat.isFile()) {
      return
    }

    const destFilePath = resolve(destPath, file.slice(templatePath.length))
    mkdirSync(dirname(destFilePath), {
      recursive: true,
    })
    if (file.endsWith('.mustache')) {
      const newFilePath = destFilePath.slice(
        0,
        destFilePath.length - '.mustache'.length,
      )
      writeFileSync(
        newFilePath,
        // wrong typing from @types/mustache
        // eslint-disable-next-line
        Mustache.render(readFileSync(file).toString(), {
          packageName,
        }),
      )
    } else {
      copyFileSync(file, destFilePath)
    }
  })

  console.log(`\nRunning \`yarn install\`..\n`)
  console.log(
    (
      await runCommand('yarn install', {
        cwd: destPath,
      })
    ).stdout,
  )

  console.log(bold(cyan(`\n\nYour project \`${packageName}\` is ready 🚀\n`)))
  const structure = args.structure || 'multiple'

  console.log(`- To run development mode run the following commands:`)

  if (structure === 'single') {
    console.log(`    >`, green(`cd ${destPath}`))
    console.log(`    >`, green(`yarn dev`))
  } else {
    const parentPath = resolve(rootPath, '..')
    console.log(`    >`, green(`cd ${parentPath}`))
    console.log(`    >`, green(`yarn dev ${packageName}`))
  }

  return { destPath }
}
