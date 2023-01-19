const numberFromStringMessage = (forbiddenToken) => `"Usage of ${forbiddenToken} is forbidden. Create one utility function "numberFromString()" that 1) parses a number from a string with Number(), 2) adds an exception to the eslint rule, 3) checks for NaN with Number.isNaN(), 4) checks for infinities with Number.isFinite(), 4) return the parsed number or undefined if the checks failed.`

module.exports = {
  root: true,
  extends: [
    'prettier',
    'eslint:recommended',
  ],
  plugins: [
    'prettier',
    'functional',
  ],
  parser: '@typescript-eslint/parser',
  overrides: [
    // For parsing ts files with type information
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          './tsconfig.eslint.json',
          './packages/*/tsconfig.json'
        ],
      },
      plugins: [
        '@typescript-eslint',
      ],
      rules: {
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': ['warn', {
          args: "none",
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }],
      },
    },
    {
      files: ["*.test.ts", "*.test.tsx"],
      env: {
        jest: true,
        node: true,
      }
    }
  ],
  rules: {
    'no-warning-comments': 'warn',
    'use-isnan': 'error',
    'eqeqeq': 'error',
    'no-var': 'error',
    'no-bitwise': 'error',
    'no-console': ['warn', {
      allow: ['warn', 'error'],
    }],
    'no-inline-comments': 'warn',
    'no-param-reassign': 'error',
    'no-implicit-coercion': 'error',
    'functional/immutable-data': 'error',
    'functional/no-let': 'error',
    'functional/no-throw-statement': 'error',
    'functional/no-class': 'error',
    'functional/no-mixed-type': 'error',
    'functional/no-this-expression': 'error',
    'functional/no-loop-statement': 'error',
    'functional/no-promise-reject': 'error',
    'no-unused-vars': [
      'off',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': ['warn', {
      bracketSpacing: true,
      printWidth: 80,
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
      singleAttributePerLine: true
    }],
    "yoda": 'warn',
    "no-restricted-properties": [
      'error',
      {
        "object": "Number",
        "property": "parseInt",
        "message": numberFromStringMessage('Number.parseInt()')
      },
      {
        "object": "Number",
        "property": "parseFloat",
        "message": numberFromStringMessage('Number.parseFloat()')
      }
    ],
    "no-restricted-syntax": [
      "error",
      {
        "selector": "CallExpression[callee.name='parseInt']",
        "message": numberFromStringMessage('parseInt()')
      },
      {
        "selector": "CallExpression[callee.name='parseFloat']",
        "message": numberFromStringMessage('parseFloat()')
      },
      {
        "selector": "CallExpression[callee.name='Number']",
        "message": numberFromStringMessage('Number()'),
      },
      // Function expressions are useful in a few contexts of higher order components when the function needs to be named.
      // {
      //   "selector": "FunctionExpression",
      //   "message": "Prefer arrow functions over function expressions."
      // },
      {
        "selector": "FunctionDeclaration",
        "message": "Prefer arrow functions over function declarations."
      }
    ]
  },
}
