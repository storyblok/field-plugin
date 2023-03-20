import { resolve } from 'path'

export const TEMPLATES = [
  {
    title: 'Vue 2',
    // description: 'some description if exists',
    value: 'vue2',
  },
  {
    title: 'React',
    description: 'Field Plugin template created with React and Typescript.',
    value: 'react',
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
