import { Chalk } from 'chalk'

const chalk = new Chalk({ level: 1 })

export const green = (text: string) => chalk.green(text)
export const gray = (text: string) => chalk.gray(text)
export const red = (text: string) => chalk.red(text)
export const bold = (text: string) => chalk.bold(text)
