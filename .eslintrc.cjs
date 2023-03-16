module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  settings: { 'svelte3/typescript': () => require('typescript') },
  rules: {
    'max-len': ['error', { code: 100 }],
    'max-lines': ['error', { code: 200 }],
    indent: ['error', 'tab'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'object',
          'type',
          'index',
        ],
      },
    ],
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
