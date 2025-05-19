import WorldHelper from '#helpers/world_creator'
import WorldScene from '#models/world_scene'
import { DrawingType } from '#validators/drawing'
import { SceneType } from '#validators/scene'
import type { HttpContext } from '@adonisjs/core/http'

export default class RuntimeController {
  public async play({ inertia, params, response }: HttpContext) {
    const { world } = params

    const manifests = await WorldHelper.readWorldAndSystemManifest(world)

    if (!manifests) {
      return response.notFound('World not found or invalid system')
    }

    await WorldHelper.runWorldMigrationsAndOptionalSeeders(world)

    return inertia.render('runtime/play', {
      title: 'Play',
      description: 'Play description',
      world: manifests.world,
      system: manifests.system,
      views: await WorldHelper.loadSystemViews(manifests.system),
      scripts: await WorldHelper.loadSystemScripts(manifests.system, manifests.world),
      scenes: (await WorldScene.query()
        .orderBy('created_at', 'desc')
        .preload('drawings')) as unknown as (SceneType & {
        drawings: Array<DrawingType>
      })[],
    })
  }
}
