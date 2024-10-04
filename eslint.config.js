import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import unusedImports from "eslint-plugin-unused-imports";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config({
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
    ],
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist', 'src/services/**'],
    languageOptions: {
        'ecmaVersion': 2020,
        'globals': globals.browser,
    },
    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        'unused-imports': unusedImports,
        'simple-import-sort': eslintPluginSimpleImportSort
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
            'warn',
            {
                'allowConstantExport': true
            },
        ],
        'no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                'vars': 'all',
                'varsIgnorePattern': '^_',
                'args': 'after-used',
                'argsIgnorePattern': '^_',
            },
        ],
        'semi': ['error', 'never'],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    },
})
