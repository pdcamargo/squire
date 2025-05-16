import { configApp } from '@adonisjs/eslint-config'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default configApp({
  // ignore inertia folder ./inertia
  ignores: ['inertia/**/*'],
})
