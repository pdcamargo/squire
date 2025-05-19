import path from 'node:path'

import type { HttpContext } from '@adonisjs/core/http'
import mime from 'mime-types'

import AppFS from '#helpers/app_fs'
import AppPath from '#helpers/app_path'
import WorldHelper from '#helpers/world_helper'

export default class AssetsController {
  public async show({ request, response, params }: HttpContext) {
    const { maxAge = '60' } = request.qs()

    const finalMaxAge = (() => {
      if (Number.isNaN(Number(maxAge))) {
        return 60
      }
      if (Number(maxAge) < 0) {
        return 0
      }
      if (Number(maxAge) > 31536000) {
        return 31536000
      }
      return Number(maxAge)
    })()

    const worldExists = await AppPath.checkWorldExists(params.world)

    if (!worldExists) {
      return response.notFound('World not found')
    }

    const worldDir = AppPath.worldPath(params.world)

    const segments = params['*'] as string[]
    const filePath = path.join(worldDir, ...segments)

    if (!filePath.startsWith(worldDir)) {
      return response.forbidden('Access denied')
    }

    return this.#createStream(response, filePath, finalMaxAge)
  }

  public async showSystem({ request, response, params }: HttpContext) {
    const { maxAge = '60' } = request.qs()

    const finalMaxAge = (() => {
      if (Number.isNaN(Number(maxAge))) {
        return 60
      }
      if (Number(maxAge) < 0) {
        return 0
      }
      if (Number(maxAge) > 31536000) {
        return 31536000
      }
      return Number(maxAge)
    })()

    const world = params.world

    if (!(await AppPath.checkWorldExists(world))) {
      return response.notFound('World not found')
    }

    const manifest = await WorldHelper.readWorldAndSystemManifest(world)
    if (!manifest) {
      return response.notFound('World not found or invalid system')
    }

    const systemDir = AppPath.systemPath(manifest.system.id)

    const segments = params['*'] as string[]
    const filePath = path.join(systemDir, ...segments)

    return this.#createStream(response, filePath, finalMaxAge)
  }

  #createStream = (response: HttpContext['response'], filePath: string, maxAge: number) => {
    const readStream = AppFS.createReadStream(filePath)

    readStream.on('error', (err) => {
      return response.status(500).send(err.message)
    })

    response.header('Content-Type', mime.lookup(filePath) || 'application/octet-stream')

    response.header('Cache-Control', `public, max-age=${maxAge}`)

    // return params
    return response.stream(readStream)
  }
}
