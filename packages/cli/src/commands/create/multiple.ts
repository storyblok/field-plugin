import { existsSync } from 'fs'
import { bold, cyan, red } from 'kleur/colors'
import { resolve } from 'path'
import { MONOREPO_FOLDER_NAME, MONOREPO_URL } from '../../const'
import { runCommand } from '../../utils'

type CreateMonorepoFunc = (args: { dir: string }) => Promise<void>

const getPossibleFolderName = (dir: string) => {
  if (!existsSync(resolve(dir, MONOREPO_FOLDER_NAME))) {
    return MONOREPO_FOLDER_NAME
  }
  // eslint-disable-next-line functional/no-loop-statement, functional/no-let
  for (let count = 2; count < 100; count++) {
    const postfix = `-${count}`
    if (!existsSync(resolve(dir, `${MONOREPO_FOLDER_NAME}${postfix}`))) {
      return `${MONOREPO_FOLDER_NAME}${postfix}`
    }
  }
  console.log(
    bold(red('[ERROR]')),
    `The folder \`${MONOREPO_FOLDER_NAME}\` already exists.`,
  )
  process.exit(1)
}

export const createMonorepo: CreateMonorepoFunc = async ({ dir }) => {
  const folderName = getPossibleFolderName(dir)
  const repoDir = resolve(dir, folderName)

  console.log(bold(cyan('[info] Creating a repository at the following path:')))
  console.log(`  > ${repoDir}`)
  await runCommand(`git clone ${MONOREPO_URL} ${folderName}`, {
    cwd: dir,
  })

  console.log(bold(cyan('[info] Running `yarn install`...')))
  await runCommand(`yarn install`, { cwd: repoDir })

  console.log(bold(cyan('[info] Running `yarn plugin:add`...')))
  await runCommand(`yarn plugin:add --dir "field_plugins/"`, {
    cwd: repoDir,
    shell: true,
    stdio: 'inherit',
  })
}
