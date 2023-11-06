export default {
  entries: ['./src/index.ts'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: ['react', 'react-dom', '@storyblok/field-plugin'],
 
}