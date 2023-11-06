export default {
  entries: ['./src/index.ts'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: ['vue', '@storyblok/field-plugin'],

}