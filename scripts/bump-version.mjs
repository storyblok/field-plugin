#!/usr/bin/env zx

import { $, which } from 'zx'
import prompts from 'prompts'
import semver from 'semver'
import { readFileSync } from 'fs'
import { bold, cyan, green, red } from 'kleur/colors'

const print = (...args) => {
  // eslint-disable-next-line no-undef, no-console
  console.log(...args)
}

const exit = (code) => {
  // eslint-disable-next-line no-undef
  process.exit(code)
}

const PACKAGE_FOLDERS = [
  {
    title: 'Library',
    value: 'field-plugin',
  },
  {
    title: 'CLI',
    value: 'cli',
  },
]

// Check if `gh` exists
if (!(await which('gh', { nothrow: true }))) {
  print(
    bold(red('[Error]')),
    'Cannot find `gh` command. Please install it via the following command:',
  )
  print('  > brew install gh')
  print('')
  print('or visit https://cli.github.com/')
  exit(1)
}

// Check if authenticated with `gh`
try {
  await $`gh auth status`.quiet()
} catch (processOutput) {
  if (processOutput.exitCode === 1) {
    print(
      bold(red('[Error]')),
      'You need to authenticate with `gh`. Run the following command:',
    )
    print('  > gh auth login')
    exit(1)
  }
}

// Check if the current branch is `main`
// const currentBranch = await $`git branch --show-current`
// if (currentBranch.toString().trim() !== 'main') {
//   print(bold(red('[Error]')), 'This command runs only from `main` branch.')
//   exit(1)
// }

// // Check if the working directory is clean
// try {
//   await $`git diff-index --quiet HEAD --`
// } catch (processOutput) {
//   if (processOutput.exitCode === 1) {
//     print(
//       bold(red('[Error]')),
//       'There are uncommitted changes in the working directory. Please clean them up before proceeding.',
//     )
//     exit(1)
//   }
// }

// Select which package to deploy ('field-plugin' | 'cli')
const { packageFolder } = await prompts({
  type: 'select',
  name: 'packageFolder',
  message: 'What to deploy?',
  choices: PACKAGE_FOLDERS,
})

// Get the current version
const { version: currentVersion, name: packageName } = JSON.parse(
  readFileSync(`packages/${packageFolder}/package.json`).toString(),
)

print('')
print(bold(cyan('💡 Commits since last release')))
print('')
const commits = (
  await $`git log ${packageName}@${currentVersion}..HEAD --oneline -- packages/${packageFolder}/`.quiet()
).toString()
commits.split('\n').forEach((line) => print('  ', line))

print(bold(green('✔')), bold('Current version ›'), currentVersion)
const prerelease = semver.prerelease(currentVersion)

// Get the next version
// eslint-disable-next-line functional/no-let
let nextVersion
if (prerelease) {
  // e.g. prerelease === ['alpha', 8]
  const result = await prompts({
    type: 'text',
    name: 'nextVersion',
    message: 'Next version?',
    initial: semver.inc(currentVersion, 'prerelease', prerelease[0]),
  })
  nextVersion = result.nextVersion
} else {
  const { incrementLevel } = await prompts({
    type: 'select',
    name: 'incrementLevel',
    message: 'Increment Level?',
    choices: [{ value: 'patch' }, { value: 'minor' }, { value: 'major' }],
  })

  const result = await prompts({
    type: 'text',
    name: 'nextVersion',
    message: 'Next version?',
    initial: semver.inc(currentVersion, incrementLevel),
  })
  nextVersion = result.nextVersion
}

// Check out to a release branch
// const branchName = `chore/release-${packageFolder}-${nextVersion}`
// await $`git checkout -b ${branchName}`

// // Update the version
// await $`cd packages/${packageFolder} && npm version ${nextVersion} --no-git-tag-version`
// await $`yarn install`

// // Create a pull-request
// await $`git add .`
// const commitMessage = `chore: release ${packageName}@${nextVersion}`
// await $`git commit -m ${commitMessage}`
// await $`git push -u origin ${branchName}`
// await $`gh pr create --title ${commitMessage} --web`
