#!/usr/bin/env -S node_modules/.bin/tsx
// https://github.com/google/zx/issues/467#issuecomment-1577838056

import { $, which } from 'zx'
import { betterPrompts } from '../packages/cli/src/utils'
import semver, { type ReleaseType } from 'semver'
import { readFileSync } from 'fs'
import { bold, cyan, green, red } from 'kleur/colors'

const print = (...args: string[]) => {
  console.log(...args)
}

const exit = (code: number) => {
  process.exit(code)
}

type PackageFolder = 'field-plugin' | 'cli'
const PACKAGE_FOLDERS: Array<{ title: string; value: PackageFolder }> = [
  {
    title: 'Library',
    value: 'field-plugin',
  },
  {
    title: 'CLI',
    value: 'cli',
  },
]

const COMMIT_SCOPE = {
  '@storyblok/field-plugin': 'lib',
  '@storyblok/field-plugin-cli': 'cli',
}

type PackageName = keyof typeof COMMIT_SCOPE

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
const currentBranch = await $`git branch --show-current`
if (currentBranch.toString().trim() !== 'main') {
  print(bold(red('[Error]')), 'This command runs only from `main` branch.')
  exit(1)
}

// Check if the working directory is clean
const isWorkingDirectoryClean =
  (await $`git status --porcelain`.quiet()).toString().trim() === ''
if (!isWorkingDirectoryClean) {
  const { proceed } = await betterPrompts<{ proceed: boolean }>({
    type: 'confirm',
    name: 'proceed',
    message:
      'There are uncommitted changes in the working directory. Do you want to continue including those changes?',
    initial: false,
  })
  if (!proceed) {
    exit(1)
  }
}

// Select which package to deploy ('field-plugin' | 'cli')
const { packageFolder } = await betterPrompts<{ packageFolder: PackageFolder }>(
  {
    type: 'select',
    name: 'packageFolder',
    message: 'What to deploy?',
    choices: PACKAGE_FOLDERS,
  },
  {
    onCancel: () => {
      process.exit(1)
    },
  },
)

// Get the current version
const { version: currentVersion, name: packageName } = JSON.parse(
  readFileSync(`packages/${packageFolder}/package.json`).toString(),
) as { version: string; name: PackageName }

const latestVersionTag = `${packageName}@${currentVersion}`
print('')
print(
  bold(cyan(`🏷️  Fetch latest version tag:`)),
  bold(green(`${latestVersionTag}`)),
)
try {
  await $`git fetch origin tag ${latestVersionTag} --no-tags`.quiet()
} catch {
  print(
    bold(red('[Error]')),
    `Error while fetching the latest version tag ${latestVersionTag}`,
  )
  exit(1)
}

print('')
print(bold(cyan('💡 Commits since last release')))
const commits = (
  await $`git log ${packageName}@${currentVersion}..HEAD --oneline -- packages/${packageFolder}/`.quiet()
).toString()
commits.split('\n').forEach((line) => print('  ', line))

print(bold(green('✔')), bold('Current version ›'), currentVersion)
const prerelease = semver.prerelease(currentVersion)

// Get the next version
let nextVersion: string
if (prerelease && typeof prerelease[0] === 'string') {
  // e.g. prerelease === ['alpha', 8]
  const result = await betterPrompts<{ nextVersion: string }>(
    {
      type: 'text',
      name: 'nextVersion',
      message: 'Next version?',
      initial: semver.inc(currentVersion, 'prerelease', prerelease[0]) ?? '',
    },
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )
  nextVersion = result.nextVersion
} else {
  const { incrementLevel } = await betterPrompts<{
    incrementLevel: ReleaseType
  }>(
    {
      type: 'select',
      name: 'incrementLevel',
      message: 'Increment Level?',
      choices: ['patch', 'minor', 'major'].map((value) => ({
        title: value,
        value,
      })),
    },
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )

  const result = await betterPrompts<{ nextVersion: string }>(
    {
      type: 'text',
      name: 'nextVersion',
      message: 'Next version?',
      initial: semver.inc(currentVersion, incrementLevel) ?? '',
    },
    {
      onCancel: () => {
        process.exit(1)
      },
    },
  )
  nextVersion = result.nextVersion
}

if (packageFolder === 'cli') {
  const { updateLibraryVersion } = await betterPrompts<{
    updateLibraryVersion: boolean
  }>({
    type: 'confirm',
    name: 'updateLibraryVersion',
    message:
      'Update the `@storyblok/field-plugin` version in all the templates?',
    initial: true,
  })
  if (updateLibraryVersion) {
    await $`./scripts/update-templates.mjs`
  }
}

// Check out to a release branch
const branchName = `chore/release-${packageFolder}-${nextVersion}`
await $`git checkout -b ${branchName}`

// Update the version
await $`cd packages/${packageFolder} && npm version ${nextVersion} --no-git-tag-version --workspaces --no-workspaces-update`
await $`yarn install`

// Create a pull-request
await $`git add .`
const scope = COMMIT_SCOPE[packageName]
const commitMessage = `chore(${scope}): release ${packageName}@${nextVersion}`
const prBody = `## What?\n\nThis PR updates the ${scope} version for release.`
await $`git commit -m ${commitMessage}`
await $`git push -u origin ${branchName}`
await $`gh pr create --title ${commitMessage} --body ${prBody} --web`
