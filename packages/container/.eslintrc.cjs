module.exports = {
  root: false,
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', 'prefer-arrow', 'functional',
    '@typescript-eslint',],
  env: {
    jest: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    React: true,
    JSX: true,
  },
  rules: {
    'no-var': 'error',
    'prefer-arrow/prefer-arrow-functions': 'error',
    'functional/immutable-data': 'error',
    'functional/no-let': 'error',
    'functional/no-class': 'error',
    'functional/no-mixed-type': 'error',
    'functional/no-this-expression': 'error',
    'functional/no-loop-statement': 'error',
    'functional/no-promise-reject': 'error',
    'no-unused-vars': [
      'warn',
      {
        args: "none",
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
  },
};