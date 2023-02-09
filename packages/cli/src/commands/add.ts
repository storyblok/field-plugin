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
import { runCommand } from '../utils'

export type AddArgs = {
  packageName?: string
  template?: string
  dir?: string
  showInstructionFor?: 'single' | 'multiple'
}

export type AddFunc = (args: AddArgs) => Promise<void>

const askPackageName = async () => {
  const { packageName } = (await prompts(
    [
      {
        type: 'text',
        name: 'packageName',
        message:
          'What is your package name?\n  (Lowercase alphanumeric and dash are allowed.)',
        validate: (name: string) => new RegExp(/^[a-z0-9\\-]+$/).test(name),
      },
    ],
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )) as { packageName: string }
  return packageName
}

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

  const packageName = args.packageName || (await askPackageName())
  const template = args.template || (await selectTemplate())
  const rootPath = resolve(args.dir || '.')
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
  const showInstructionFor = args.showInstructionFor || 'multiple'

  console.log(`- To run development mode run the following commands:`)

  if (showInstructionFor === 'single') {
    console.log(`    >`, green(`cd ${destPath}`))
    console.log(`    >`, green(`yarn dev`))
    return
  }

  const parentPath = resolve(rootPath, '..')
  console.log(`    >`, green(`cd ${parentPath}`))
  console.log(`    >`, green(`yarn dev ${packageName}`))
}
