import type { HttpContext } from '@adonisjs/core/http'

import AppPath from '#helpers/app_path'
import WorldHelper from '#helpers/world_helper'
import WorldUser from '#models/world_user'

export default class AuthController {
  public async login({ request, auth, response, params }: HttpContext) {
    const { world } = params as { world: string }

    if (!AppPath.checkWorldExists(world)) {
      return response.unauthorized('World does not exist')
    }

    const { username, password } = request.only(['username', 'password'])

    const user = await WorldUser.verifyCredentials(username, password)

    await auth.use('web').login(user)

    response.redirect().toPath(`/${world}/play`)
  }

  public async loginPage({ inertia, params, response }: HttpContext) {
    const { world } = params as { world: string }

    if (!(await AppPath.checkWorldExists(world))) {
      return response.notFound('World does not exist')
    }

    await WorldHelper.runWorldMigrationsAndOptionalSeeders(world)

    const users = await WorldUser.all()

    return inertia.render('login', {
      users,
      world,
    })
  }
}
