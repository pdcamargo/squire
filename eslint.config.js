import { configApp } from '@adonisjs/eslint-config'
import importPlugin from 'eslint-plugin-import'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  ...configApp({
    // ignore inertia folder ./inertia
    ignores: ['inertia/**/*'],
  }),
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['inertia/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            ['internal', 'unknown'],
            ['sibling', 'parent', 'index'],
            'object',
          ],
          'pathGroups': [
            {
              pattern: 'react',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '#**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@**',
              group: 'external',
              position: 'after',
            },
          ],
          'pathGroupsExcludedImportTypes': [],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]
