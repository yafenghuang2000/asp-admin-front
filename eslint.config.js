import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules', '*.min.js', '*.d.ts', 'vite.config.ts', 'build', 'coverage'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      import: importPlugin,
      prettier,
      '@typescript-eslint': tseslint,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        alias: {
          map: [
            ['@', './src'], // 假设你的项目中 '@' 别名指向 'src' 目录
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // React 相关规则
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-key': 'error',
      'react/prop-types': 'error',

      // // TypeScript 相关规则
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^React$',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      ...reactHooks.configs.recommended.rules, //检查 React Hooks 的使用是否符合最佳实践
      ...reactRefresh.configs.recommended.rules, //检查 React 组件是否只导出常量
      ...react.configs.recommended.rules, //检查 React 组件是否只导出常量
      ...importPlugin.configs.recommended.rules, //检查导入的顺���
      ...prettier.configs.recommended.rules, //禁用与 Prettier 冲突的 ESLint 规则
      ...tseslint.configs.recommended.rules, //检查 TypeScript 代码是否符合最佳实践

      // 通用规则
      'no-console': ['warn', { allow: ['log', 'warn'] }],
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // 使用 TypeScript 的规则替代
      'prefer-const': 'error',
      'no-var': 'error',

      // 最佳实践
      eqeqeq: ['error', 'always'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      // 'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: true }],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'no-param-reassign': 'error',

      // 导入规则
      'import/order': [
        'error',
        {
          groups: ['external', 'internal'],
          'newlines-between': 'never',
          // alphabetize: false,
        },
      ],

      // 代码风格
      indent: ['error', 2, { SwitchCase: 1 }],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'max-lines': ['error', { max: 300 }],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
        },
      ],
      // 命名规范
      camelcase: [
        'error',
        {
          properties: 'never',
          ignoreDestructuring: true,
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
      ],

      'react/react-in-jsx-scope': 'off',
    },
  },
];
