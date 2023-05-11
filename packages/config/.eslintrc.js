/* eslint-disable unicorn/prefer-module */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:unicorn/recommended',
  ],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unicorn', 'tailwindcss'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    // Allow custom classnames
    'tailwindcss/no-custom-classname': 'off',
    // Allow abbreviations
    'unicorn/prevent-abbreviations': 'off',
  },

  /*
    xxx.tsx => PascalCase

    withXXX.tsx => camelCase
    useXXX.tsx => camelCase

    xxx.ts => kebap-case
    pages/xxx.tsx => kebap-case

    Problems: shieldRules, usewrongcase, wrongCase, wrongCasePage
    creteContext, createRouter, updateAccount
  */
  overrides: [
    {
      files: [
        // All .tsx files
        '**/*.tsx',
      ],
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            case: 'pascalCase',
          },
        ],
      },
    },
    {
      files: [
        // All useXXX (hooks) and withXXX (hoc) files
        '**/{with,use}*.tsx',
      ],
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            case: 'camelCase',
          },
        ],
      },
    },
    {
      files: [
        // All pages .tsx files
        '**/pages/**/*.tsx',
        // All .ts and .js files
        '**/*.{ts,js}',
      ],
      rules: {
        'unicorn/filename-case': [
          'error',
          {
            case: 'kebabCase',
          },
        ],
      },
    },
  ],
};
