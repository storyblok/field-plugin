import { bold, cyan, red, green } from 'kleur/colors'
import { resolve, dirname } from 'path'
import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import walk from 'walkdir'
import { MONOREPO_TEMPLATE_PATH, TEMPLATES, TEMPLATES_PATH } from '../../config'
import {
  betterPrompts,
  filterPathsToInclude,
  promptName,
  runCommand,
} from '../utils'

export type Template = 'vue2'

export type Structure = 'polyrepo' | 'monorepo'

export type AddArgs = {
  dir: string
  name?: string
  template?: Template
  structure?: Structure
}

export type PackageJson = {
  name: string
  scripts: {
    deploy: string
  }
}

export type AddFunc = (args: AddArgs) => Promise<{ destPath: string }>

const selectTemplate = async () => {
  const { template } = await betterPrompts<{ template: string }>([
    {
      type: 'select',
      name: 'template',
      message: 'Which template?',
      choices: TEMPLATES,
    },
  ])
  return template
}

export const add: AddFunc = async (args) => {
  const structure = args.structure || 'polyrepo'

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
  const repoRootPath =
    structure === 'monorepo' ? resolve(rootPath, '..') : destPath

  if (!existsSync(templatePath)) {
    console.log(
      bold(red('[ERROR]')),
      `The template '${template}' is not found.`,
    )
    process.exit(1)
  }

  walk.sync(templatePath, { filter: filterPathsToInclude }, (file, stat) => {
    if (!stat.isFile()) {
      return
    }

    const destFilePath = resolve(destPath, file.slice(templatePath.length))
    mkdirSync(dirname(destFilePath), {
      recursive: true,
    })

    if (file === resolve(templatePath, 'package.json')) {
      const packageJson = JSON.parse(
        readFileSync(file).toString(),
      ) as PackageJson

      // eslint-disable-next-line functional/immutable-data
      packageJson['name'] = packageName

      if (args.structure === 'monorepo') {
        // eslint-disable-next-line functional/immutable-data, @typescript-eslint/no-unsafe-member-access
        packageJson['scripts']['deploy'] += " --dotEnvPath '../../.env'"
      }

      writeFileSync(destFilePath, JSON.stringify(packageJson, null, 2))
      return
    }

    if (file === resolve(templatePath, 'gitignore')) {
      const destGitIgnore = resolve(destPath, `.gitignore`)
      copyFileSync(file, destGitIgnore)
      return
    }

    copyFileSync(file, destFilePath)
  })

  if (structure === 'polyrepo') {
    // Polyrepo gets .env.local.example copied from the monorepo template.
    copyFileSync(
      resolve(MONOREPO_TEMPLATE_PATH, '.env.local.example'),
      resolve(destPath, '.env.local.example'),
    )
  }

  console.log(`\nRunning \`yarn install\`..\n`)
  console.log(
    (
      await runCommand('yarn install', {
        cwd: destPath,
      })
    ).stdout,
  )

  console.log(bold(cyan(`\n\nYour project \`${packageName}\` is ready 🚀\n`)))
  console.log(`- To run development mode run the following commands:`)
  console.log(`    >`, green(`cd ${repoRootPath}`))
  if (structure === 'polyrepo') {
    console.log(`    >`, green(`yarn dev`))
  } else if (structure === 'monorepo') {
    console.log(`    >`, green(`yarn workspace ${packageName} dev`))
  }

  console.log(`\n\n- To deploy the newly created field plugin to Storyblok:`)
  console.log(`    >`, green(`cd ${repoRootPath}`))
  if (structure === 'polyrepo') {
    console.log(`    >`, green(`yarn deploy`))
  } else if (structure === 'monorepo') {
    console.log(`    >`, green(`yarn workspace ${packageName} deploy`))
  }
  return { destPath }
}
