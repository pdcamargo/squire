import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import AppPath from '#helpers/app_path'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/:world/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    const currentWorld = ctx.params.world
    if (!currentWorld) {
      ctx.response.status(404).send('World not found')
      return
    }
    // Check if the world exists
    const worldExists = await AppPath.checkWorldExists(currentWorld)
    if (!worldExists) {
      ctx.response.status(404).send('World not found')
      return
    }
    // Check if the world is running
    // TODO: do the above
    const finalLoginRoute = this.redirectTo.replace(':world', currentWorld)

    await ctx.auth.authenticateUsing(options.guards, { loginRoute: finalLoginRoute })
    return next()
  }
}
