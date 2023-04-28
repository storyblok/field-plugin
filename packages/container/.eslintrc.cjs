module.exports = {
  root: false,
  extends: ['plugin:react/recommended'],
  plugins: [
    "react-hooks"
  ],
  globals: {
    React: true,
    JSX: true,
  },
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'react/prop-types': 'off',
  }
}