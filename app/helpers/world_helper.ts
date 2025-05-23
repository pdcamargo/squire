import path from 'node:path'

import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import { MigrationRunner } from '@adonisjs/lucid/migration'
import db from '@adonisjs/lucid/services/db'

import AppFS from '#helpers/app_fs'
import AppPath from '#helpers/app_path'
import SystemHelper from '#helpers/system_helper'
import Utils from '#helpers/utils'
import WorldScene from '#models/world_scene'
import WorldUser from '#models/world_user'
import { SystemType } from '#validators/system'
import { WorldType } from '#validators/world'

type CreateWorldArgs = {
  name: string
  description?: string | null
  system: string
}

export default class WorldHelper {
  public static async listWorlds() {
    await AppPath.ensureAppStructure()

    const worlds = await AppFS.getDirFolders(AppPath.worlds)

    const res = await Promise.all(
      worlds.map(async (world: string) => {
        const manifests = await WorldHelper.readWorldAndSystemManifest(path.basename(world))

        if (!manifests) {
          return null
        }

        return {
          ...manifests,
        } as const
      })
    )

    return res.filter((world): world is { world: WorldType; system: SystemType } => world !== null)
  }

  public static async createWorld({ name, description, system }: CreateWorldArgs) {
    await AppPath.ensureAppStructure()

    if (!(await AppPath.checkSystemExists(system))) {
      throw new Error(`System "${system}" does not exist.`)
    }

    // ensure we don't have a world with the same name, and keep increasing a suffix
    let worldPath = AppPath.worldPath(string.slug(name.toLowerCase()))

    let worldExists = await AppFS.checkPathExists(worldPath)
    let suffix = 1

    let finalSlug = string.slug(name.toLowerCase())

    while (worldExists) {
      finalSlug = `${string.slug(name.toLowerCase())}-${suffix}`
      worldPath = AppPath.worldPath(finalSlug)
      worldExists = await AppFS.checkPathExists(worldPath)
      suffix++
    }

    await AppFS.ensureDirExists(worldPath)

    await AppFS.writeJson<WorldType>(path.join(worldPath, 'world.json'), {
      id: finalSlug,
      name,
      description: description || '',
      system,
      lastPlayed: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: [],
    })

    await AppFS.ensureDirExists(path.join(worldPath, 'data'))
    await AppFS.ensureDirExists(path.join(worldPath, 'assets'))
    await AppFS.ensureDirExists(path.join(worldPath, 'scenes'))

    const settingsDbFileName = path.join(path.join(worldPath, 'data'), 'world.db')

    db.manager.patch('world', {
      client: 'better-sqlite3',
      connection: {
        filename: settingsDbFileName,
      },
    })

    const migrator = new MigrationRunner(db, app, {
      direction: 'up',
      dryRun: false,
      connectionName: 'world',
    })

    await migrator.run()

    await Utils.delay(250)

    await this.runWorldMigrationsAndOptionalSeeders(finalSlug)

    return {
      path: worldPath,
      name,
      slug: finalSlug,
    }
  }

  public static async readWorldAndSystemManifest(worldName: string) {
    const worldPath = AppPath.worldPath(worldName)
    const manifest = await AppFS.readJson<WorldType>(AppPath.join(worldPath, 'world.json'))

    if (!manifest) {
      return null
    }

    const systemManifest = await SystemHelper.readSystemManifest(manifest.system)

    if (!systemManifest) {
      return null
    }

    return {
      world: manifest,
      system: systemManifest,
    }
  }

  public static async loadSystemViews(system: SystemType) {
    const viewsBasePath = system.paths?.views || './views'
    const viewsPath = path.join(AppPath.systemPath(system.id), viewsBasePath)

    const paths = await AppFS.getDirContent(viewsPath)

    // everything that is a handlebars (.hbs) file
    const handlebarsFiles = paths.filter((file) => file.endsWith('.hbs'))

    // we load the content of the handlebars files and return an object with the file name as key and the content as value
    const handlebarsContents = await Promise.all(
      handlebarsFiles
        .map(async (file) => {
          const content = await AppFS.readFile(path.resolve(file))

          if (!content) {
            return null
          }

          let fileName = file.replace('.hbs', '').replace(viewsPath, '')

          // we remove the leading slash if it exists
          if (fileName.startsWith('\\')) {
            fileName = fileName.slice(1)
          }

          // replace all \ with /
          fileName = fileName.replace(/\\/g, '/')

          return {
            [fileName]: content,
          }
        })
        .filter((file) => file !== null)
    )

    const nonNullHandlebarsContents = handlebarsContents.filter((file) => file !== null) as Record<
      string,
      string
    >[]

    // we merge the objects into one
    const mergedContents = nonNullHandlebarsContents.reduce((acc, curr) => {
      return { ...acc, ...curr }
    }, {})
    // we return the merged object
    return mergedContents
  }

  public static async loadSystemScripts(system: SystemType, world: WorldType) {
    const scriptsBasePath = system.paths?.scripts || './scripts'
    const scriptsPath = path.join(AppPath.systemPath(system.id), scriptsBasePath)

    const paths = await AppFS.getDirContent(scriptsPath)

    const scriptFiles = paths.filter((file) => file.endsWith('.mjs') || file.endsWith('.js'))

    return scriptFiles.map((file) => {
      const fileName = path.basename(file)
      let filePath = `/${path
        .join(world.id, 'system', 'assets', scriptsBasePath, file.replace(scriptsPath, ''))
        .replace(/\\/g, '/')}`

      return {
        name: fileName,
        path: filePath,
      }
    })
  }

  public static async setWorldAsCurrentDb(worldName: string) {
    const worldPath = AppPath.worldPath(worldName)

    if (!(await AppFS.checkPathExists(worldPath))) {
      throw new Error(`World "${worldName}" does not exist.`)
    }

    const manifest = await AppFS.readJson<WorldType>(path.join(worldPath, 'world.json'))

    if (!manifest) {
      throw new Error(`World "${worldName}" does not exist.`)
    }

    db.manager.patch('world', {
      client: 'better-sqlite3',
      connection: {
        filename: path.join(worldPath, 'data', 'world.db'),
      },
    })
  }

  public static async runWorldMigrationsAndOptionalSeeders(worldName: string) {
    const manifests = await this.readWorldAndSystemManifest(worldName)

    if (!manifests) {
      return null
    }

    await AppFS.ensureDirExists(path.join(AppPath.worldPath(worldName), 'data'))

    db.manager.patch('world', {
      client: 'better-sqlite3',
      connection: {
        filename: path.join(AppPath.worldPath(worldName), 'data', 'world.db'),
      },
    })

    const migrator = new MigrationRunner(db, app, {
      direction: 'up',
      dryRun: false,
      connectionName: 'world',
    })

    await migrator.run()

    if (migrator.error) {
      console.error('Migration error:', migrator.error)

      throw new Error('Migration error')
    }

    await Utils.delay(250)

    const scenes = await WorldScene.all()

    if (scenes.length === 0) {
      await WorldScene.createMany([
        {
          name: 'Default Scene',
          description: 'This is the default scene.',
          backgroundColor: '#000000',
          backgroundImage: null,
          gridSize: 50,
          gridLineColor: '#0f0f0f',
          gridLineAlpha: 1,
          gridLineWidth: 1,
          gridSubLineColor: '#000',
          gridSubLineAlpha: 0.1,
          gridSubLineWidth: 1,
          worldSize: {
            width: 1000,
            height: 1000,
          },
        },
      ])
    }

    const users = await WorldUser.all()

    if (users.length === 0) {
      await WorldUser.create({
        name: 'Admin',
        username: 'admin',
        password: 'admin',
        avatar: null,
      })
    }

    return migrator.migratedFiles
  }
}
