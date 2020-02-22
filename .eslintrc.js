module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier', '@vue/typescript'],
  rules: {
    'no-unused-vars': ['warn', { "varsIgnorePattern": "I[A-Z]*" }],
    'prettier/prettier': ['error', {semi: false}],
    'no-console': ['warn', {allow: ['info', 'warn', 'error']}],
    'no-debugger': 'warn',
    'object-curly-spacing': 'off',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
}
