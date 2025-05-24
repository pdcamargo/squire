import type { HttpContext } from '@adonisjs/core/http'

import AppPath from '#helpers/app_path'
import WorldHelper from '#helpers/world_helper'
import { createWorldSchema } from '#validators/world'

export default class WorldsController {
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createWorldSchema)

    await AppPath.ensureAppStructure()

    const world = await WorldHelper.createWorld(data)

    await WorldHelper.runWorldMigrationsAndOptionalSeeders(world.slug)

    return response.json({
      message: 'World created successfully',
      data: await WorldHelper.readWorldAndSystemManifest(world.slug),
    })
  }
}
