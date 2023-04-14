import { resolve } from 'path'

export const TEMPLATES = [
  {
    title: 'Vue 2',
    description: 'Storyblok Field Plugin template created with Vue 2.',
    value: 'vue2',
  },
  {
    title: 'Vue 3',
    description: 'Storyblok Field Plugin template created with Vue 3.',
    value: 'vue3',
  },
  {
    title: 'React',
    description:
      'Storyblok Field Plugin template created with React and Typescript.',
    value: 'react',
  },
  {
    title: 'JavaScript (without a framework)',
    description: 'Field plugin without a JavaScript frontend framework.',
    value: 'js',
  },
]

/* 
  This file is at the root level of this CLI package, instead of `src/`.
  
  In production, this file will be bundled into `dist/main.cjs` later,
  and we will have `dist/templates` as well.
  So the `TEMPLATES_PATH` below makes sense (current directory -> 'templates')

  In development, this file is still right next to `templates` folder. So it's still correct.
  
  If we move this file to another folder, then we need to put correct value conditionally to `TEMPLATES_PATH`.
*/
export const TEMPLATES_PATH = resolve(__dirname, 'templates')

export const MONOREPO_TEMPLATE_PATH = resolve(
  __dirname,
  'templates',
  'monorepo',
)
