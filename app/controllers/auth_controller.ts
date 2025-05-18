import AppPath from '#helpers/app_path'
import WorldHelper from '#helpers/world_creator'
import WorldUser from '#models/world_user'
import type { HttpContext } from '@adonisjs/core/http'

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

  public async loginPage({ inertia, params }: HttpContext) {
    const { world } = params as { world: string }

    await WorldHelper.runWorldMigrationsAndOptionalSeeders(world)

    const users = await WorldUser.all()

    return inertia.render('login', {
      users,
      world,
    })
  }
}
