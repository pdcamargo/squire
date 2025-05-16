import WorldHelper from '#helpers/world_creator'
import type { HttpContext } from '@adonisjs/core/http'

export default class RuntimeController {
  public async play({ inertia, params, response }: HttpContext) {
    const { world } = params

    const manifests = await WorldHelper.readWorldAndSystemManifest(world)

    if (!manifests) {
      return response.notFound('World not found or invalid system')
    }

    await WorldHelper.runWorldMigrations(world)

    return inertia.render('runtime/play', {
      title: 'Play',
      description: 'Play description',
      world: manifests.world,
      system: manifests.system,
      views: inertia.defer(() => WorldHelper.loadSystemViews(manifests.system)),
    })
  }
}
