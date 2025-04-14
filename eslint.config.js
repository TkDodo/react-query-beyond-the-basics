import eslint from '@eslint/js'
import tseslint, { configs } from 'typescript-eslint'
// eslint-disable-next-line import-x/default
import reactHooks from 'eslint-plugin-react-hooks'
import eslintReact from '@eslint-react/eslint-plugin'
import pluginQuery from '@tanstack/eslint-plugin-query'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import * as pluginImportX from 'eslint-plugin-import-x'
// eslint-disable-next-line import-x/default
import tsParser from '@typescript-eslint/parser'

export default tseslint.config(
  eslint.configs.recommended,
  configs.strictTypeChecked,
  pluginQuery.configs['flat/recommended'],
  eslintPluginUnicorn.configs.recommended,
  eslintReact.configs['recommended-type-checked'],
  reactHooks.configs['recommended-latest'],
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,
  {
    ignores: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['**/*.js'],
    extends: [configs.disableTypeChecked],
  },
  {
    files: ['./src/routeTree.gen.ts'],
    rules: {
      'unicorn/no-abusive-eslint-disable': 'off',
    },
  },
)
