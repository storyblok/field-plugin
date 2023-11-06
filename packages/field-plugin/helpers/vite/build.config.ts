export default {
  entries: ['./src/index.ts'],
  declaration: true,
  rollup: {
    esbuild: {
      minify: true,
    },
    emitCJS: true,
  },
  externals: ['querystring', 'fs', 'path'],

}