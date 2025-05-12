import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { MigrationRunner } from '@adonisjs/lucid/migration'

import path from 'node:path'

import AppPath from '#helpers/app_path'
import AppFS from './app_fs.js'
import Utils from './utils.js'

const worldManifestTemplate = `
{
  "id": "{{ world.id }}",
  "name": "{{ world.name }}",
  "description": "{{ world.description }}",
  "compatibility": {
    "min": "{{ world.compatibility.min }}",
    "max": "{{ world.compatibility.max }}"
  },
  "system": "{{ world.system }}",
  "lastPlayed": "{{ world.lastPlayed }}",
  "lastUpdated": "{{ world.lastUpdated }}"
}
`

type WorldManifest = {
  id: string
  name: string
  description: string
  compatibility: {
    min: string
    max: string
  }
  system: string
  lastPlayed: string
  lastUpdated: string
}

type CreateWorldArgs = {
  name: string
  description?: string | null
  system: string
}

export default class WorldCreator {
  public static async listWorlds() {
    await AppPath.ensureAppStructure()

    const worlds = await AppFS.getDirContents(AppPath.worlds)

    const worldManifests = await Promise.all(
      worlds.map(async (world: any) => {
        const manifestPath = path.join(world, 'world.json')
        const manifestExists = await AppFS.checkPathExists(manifestPath)

        if (manifestExists) {
          return AppFS.readJson<WorldManifest>(manifestPath)
        }

        return null
      })
    )

    const res = worldManifests.filter((manifest: any) => manifest !== null) as WorldManifest[]

    const FAKE_CURRENT_VERSION = '1.0.0'

    const filteredWorlds = await Promise.all(
      res.map(async (world) => {
        if (!world.compatibility || !world.system) return null

        if (!(await AppPath.checkSystemExists(world.system))) return null

        return Utils.isVersionInRange(
          FAKE_CURRENT_VERSION,
          world.compatibility.min,
          world.compatibility.max
        )
          ? world
          : null
      })
    )

    return filteredWorlds.filter((world): world is WorldManifest => world !== null)
  }

  public static async createWorld({ name, description, system }: CreateWorldArgs) {
    await AppPath.ensureAppStructure()

    if (!AppPath.checkSystemExists(system)) {
      throw new Error(`System "${system}" does not exist.`)
    }

    // ensure we don't have a world with the same name, and keep increasing a suffix
    let worldPath = AppPath.worldPath(string.slug(name))

    let worldExists = await AppFS.checkPathExists(worldPath)
    let suffix = 1

    let finalSlug = string.slug(name)

    while (worldExists) {
      finalSlug = `${string.slug(name)}-${suffix}`
      worldPath = AppPath.worldPath(finalSlug)
      worldExists = await AppFS.checkPathExists(worldPath)
      suffix++
    }

    await AppFS.ensureDirExists(worldPath)

    const worldManifest = string.interpolate(worldManifestTemplate, {
      world: {
        id: finalSlug,
        name,
        description: description || '',
        compatibility: {
          min: '1.0.0',
          max: '1.3.0',
        },
        system,
        lastPlayed: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
    })

    await AppFS.writeFile(path.join(worldPath, 'world.json'), worldManifest)

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

    return {
      path: worldPath,
      name,
      slug: finalSlug,
    }
  }
}
