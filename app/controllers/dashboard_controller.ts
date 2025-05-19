import type { HttpContext } from '@adonisjs/core/http'

import AppFS from '#helpers/app_fs'
import AppPath from '#helpers/app_path'
import SystemHelper from '#helpers/system_helper'
import WorldHelper from '#helpers/world_helper'
import User from '#models/user'
import { createWorldSchema } from '#validators/world'

export default class DashboardController {
  public async create({ request }: HttpContext) {
    const payload = await request.validateUsing(createWorldSchema)

    try {
      return {
        data: await WorldHelper.createWorld(payload),
        status: 201,
      }
    } catch {
      return {
        status: 500,
      }
    }
  }

  public async worlds({ inertia }: HttpContext) {
    return inertia.render('dashboard/worlds', {
      title: 'Worlds',
      description: 'Worlds description',
      worlds: inertia.defer(() => {
        return WorldHelper.listWorlds()
      }),
    })
  }

  public async home({ inertia }: HttpContext) {
    await AppPath.ensureAppStructure()

    return inertia.render('home', {
      title: 'Dashboard',
      description: 'Dashboard description',
      manifest: {
        paths: AppPath.all,
        structure: {
          data: await AppFS.checkPathExists(AppPath.data),
          config: await AppFS.checkPathExists(AppPath.config),
          cache: await AppFS.checkPathExists(AppPath.cache),
          log: await AppFS.checkPathExists(AppPath.log),
          temp: await AppFS.checkPathExists(AppPath.temp),
          worlds: await AppFS.checkPathExists(AppPath.worlds),
          systems: await AppFS.checkPathExists(AppPath.systems),
          modules: await AppFS.checkPathExists(AppPath.modules),
          assets: await AppFS.checkPathExists(AppPath.assets),
        },
        worlds: await WorldHelper.listWorlds(),
        systems: await SystemHelper.listSystems(),
      },
    })
  }

  public async index({ inertia }: HttpContext) {
    // const pg = db.manager.patch('world', {
    //   connection: {
    //     filename: "",
    //   }
    // })

    // const files = await fs.readdir(AppPath.data, { recursive: false, withFileTypes: true })

    let users = await User.all()

    if (users.length === 0) {
      await User.create({
        email: 'admin@fantasycraft.io',
        fullName: 'Admin',
        password: '1234',
      })

      users = await User.all()
    }

    return inertia.render('dashboard/home', {
      title: 'Dashboard',
      description: 'Dashboard description',
      users,
    })
  }
}
