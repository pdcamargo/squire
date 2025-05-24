import string from '@adonisjs/core/helpers/string'
import type { HttpContext } from '@adonisjs/core/http'

import AppFS from '#helpers/app_fs'
import AppPath from '#helpers/app_path'
import SystemHelper from '#helpers/system_helper'
import { createSystemSchema, SystemType } from '#validators/system'

export default class SystemsController {
  public async create({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSystemSchema)

    const systemId = string.slug(data.name.toLowerCase())

    await AppPath.ensureAppStructure()

    if (await AppPath.checkSystemExists(systemId)) {
      return response.badRequest({
        message: `System "${systemId}" already exists.`,
      })
    }

    // ensure we don't have a system with the same name, and keep increasing a suffix
    let systemPath = AppPath.systemPath(systemId)

    let systemExists = await AppFS.checkPathExists(systemPath)
    let suffix = 1

    let finalSlug = systemId

    while (systemExists) {
      finalSlug = `${string.slug(data.name.toLowerCase())}-${suffix}`
      systemPath = AppPath.systemPath(finalSlug)
      systemExists = await AppFS.checkPathExists(systemPath)
      suffix++
    }

    await AppFS.ensureDirExists(systemPath)
    await AppFS.writeJson<SystemType>(AppPath.join(systemPath, 'system.json'), {
      id: finalSlug,
      name: data.name,
      description: data.description,
      compatibility: data.compatibility,
      tags: data.tags ?? [],
      createdAt: new Date().toISOString(),
      cover: data.cover ?? '',
      paths: {},
    })

    return response.json({
      message: 'System created successfully',
      data: await SystemHelper.readSystemManifest(finalSlug),
    })
  }
}
