import globals from 'globals'
import eslintJs from '@eslint/js'
import tsEslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Base configuration
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  prettier,
  eslintJs.configs.recommended,
  ...tsEslint.configs.recommended,

  // Vue.js configuration
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
      },
    },
  },

  // React configuration
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
  },

  // Custom rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'react/prop-types': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
    },
  },
  {
    files: ['packages/cli/templates/vue2/**'],
    rules: {
      'vue/require-prop-types': 'off',
    },
  },
]
