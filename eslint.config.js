// eslint.config.js

import globals from 'globals';
import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // 1. BASE CONFIGURATION (Applied to all files by default)
  {
    ignores: ['node_modules/', 'dist/', 'build/'],

    ...js.configs.recommended,
    ...prettierRecommended,

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2021,
      },
    },

    rules: {
      //  Quality & Style Enforcement
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],

      //  Unused Variables
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
        },
      ],

      //  Bug Prevention
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
    },
  },

  // BACKEND OVERRIDES (Node/Express code)
  {
    files: ['backend/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'error',
      'no-undef': 'error',
    },
  },

  // FRONTEND OVERRIDES (React/JSX code)
  {
    files: ['frontend/**/*.{js,jsx}'],

    plugins: {
      react,
      'react-hooks': reactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    extends: [reactRefresh.configs.vite],

    settings: {
      react: { version: 'detect' },
    },

    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Custom rules
      'no-console': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
