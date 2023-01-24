import { resolve } from 'path'

export const FIELD_PLUGINS_PATH = './field-plugins/'
export const REPO_ROOT_DIR = resolve(__dirname, '..', '..', '..')
export const TEMPLATES = [
  {
    title: 'Vue 2',
    // description: 'some description if exists',
    value: 'vue2',
  },
]
export const TEMPLATES_PATH = resolve(
  REPO_ROOT_DIR,
  'packages',
  'cli',
  'templates',
)

export const MONOREPO_URL = 'git@github.com:storyblok/field-type-template.git'
export const MONOREPO_FOLDER_NAME = 'field-plugins'
