import WorldHelper from '#helpers/world_creator'
import WorldUser from '#models/world_user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  public async login({ request, auth, response }: HttpContext) {
    const { username, password } = request.only(['username', 'password'])

    const user = await WorldUser.verifyCredentials(username, password)

    await auth.use('web').login(user)

    response.redirect('/dashboard')
  }

  public async loginPage({ inertia, params }: HttpContext) {
    const { world } = params

    await WorldHelper.runWorldMigrations(world)

    const users = await WorldUser.all()

    return inertia.render('login', {
      users,
    })
  }
}
