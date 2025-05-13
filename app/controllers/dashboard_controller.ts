import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import AppPath from '#helpers/app_path'

import fs from 'node:fs/promises'
import { createWorldSchema } from '#validators/world'
import WorldCreator from '#helpers/world_creator'
import AppFS from '#helpers/app_fs'

// import db from '@adonisjs/lucid/services/db'

export default class DashboardController {
  public async create({ request }: HttpContext) {
    const payload = await request.validateUsing(createWorldSchema)

    try {
      return {
        data: await WorldCreator.createWorld(payload),
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
        return WorldCreator.listWorlds()
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
      },
    })
  }

  public async index({ inertia }: HttpContext) {
    // const pg = db.manager.patch('world', {
    //   connection: {
    //     filename: "",
    //   }
    // })

    console.log(AppPath.all)

    const files = await fs.readdir(AppPath.data, { recursive: false, withFileTypes: true })

    console.log('Files:', files)

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
