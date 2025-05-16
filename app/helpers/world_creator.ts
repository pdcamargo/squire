import string from '@adonisjs/core/helpers/string'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { MigrationRunner } from '@adonisjs/lucid/migration'

import path from 'node:path'

import AppPath from '#helpers/app_path'
import AppFS from './app_fs.js'
import Utils from './utils.js'
import { WorldType } from '#validators/world'
import { SystemType } from '#validators/system'

const worldManifestTemplate = `
{
  "id": "{{ world.id }}",
  "name": "{{ world.name }}",
  "description": "{{ world.description }}",
  "system": "{{ world.system }}",
  "lastPlayed": "{{ world.lastPlayed }}",
  "lastUpdated": "{{ world.lastUpdated }}"
}
`

type WorldManifest = {
  id: string
  name: string
  description: string
  system: string
  lastPlayed: string
  lastUpdated: string
}

type CreateWorldArgs = {
  name: string
  description?: string | null
  system: string
}

export default class WorldHelper {
  public static async listWorlds() {
    await AppPath.ensureAppStructure()

    const worlds = await AppFS.getDirFolders(AppPath.worlds)

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
        if (!world || !world.system) return null

        if (!(await AppPath.checkSystemExists(world.system))) return null

        const systemManifest = await AppFS.readJson<{
          compatibility: {
            min: string
            max: string
          }
        }>(path.join(AppPath.systemPath(world.system), 'system.json'))

        if (!systemManifest) return null

        return Utils.isVersionInRange(
          FAKE_CURRENT_VERSION,
          systemManifest.compatibility.min,
          systemManifest.compatibility.max
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

  public static async readWorldAndSystemManifest(worldName: string) {
    if (!(await AppPath.checkWorldExists(worldName))) {
      return null
    }

    const worldPath = AppPath.worldPath(worldName)
    const manifest = await AppFS.readJson<WorldType>(AppPath.join(worldPath, 'world.json'))

    if (!manifest) {
      return null
    }

    const systemPath = AppPath.systemPath(manifest.system)
    const systemManifest = await AppFS.readJson<SystemType>(path.join(systemPath, 'system.json'))
    if (!systemManifest) {
      return null
    }
    const FAKE_CURRENT_VERSION = '1.0.0'

    if (
      !Utils.isVersionInRange(
        FAKE_CURRENT_VERSION,
        systemManifest.compatibility.min,
        systemManifest.compatibility.max
      )
    ) {
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

  public static async runWorldMigrations(worldName: string) {
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

    return migrator.migratedFiles
  }
}
