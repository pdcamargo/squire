import path from 'node:path'
import os from 'node:os'
import process from 'node:process'

import AppFS from '#helpers/app_fs'
import Utils from './utils.js'

const homedir = os.homedir()
const tmpdir = os.tmpdir()
const { env } = process

const macos = (name: string) => {
  const library = path.join(homedir, 'Library')

  return {
    data: path.join(library, 'Application Support', name),
    config: path.join(library, 'Preferences', name),
    cache: path.join(library, 'Caches', name),
    log: path.join(library, 'Logs', name),
    temp: path.join(tmpdir, name),
  }
}

const windows = (name: string) => {
  const appData = env.APPDATA || path.join(homedir, 'AppData', 'Roaming')
  const localAppData = env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local')

  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: path.join(localAppData, name, 'Data'),
    config: path.join(appData, name, 'Config'),
    cache: path.join(localAppData, name, 'Cache'),
    log: path.join(localAppData, name, 'Log'),
    temp: path.join(tmpdir, name),
  }
}

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const linux = (name: string) => {
  const username = path.basename(homedir)

  return {
    data: path.join(env.XDG_DATA_HOME || path.join(homedir, '.local', 'share'), name),
    config: path.join(env.XDG_CONFIG_HOME || path.join(homedir, '.config'), name),
    cache: path.join(env.XDG_CACHE_HOME || path.join(homedir, '.cache'), name),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: path.join(env.XDG_STATE_HOME || path.join(homedir, '.local', 'state'), name),
    temp: path.join(tmpdir, username, name),
  }
}

function envPaths(name: string, { suffix = '' } = {}) {
  if (typeof name !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof name}`)
  }

  if (suffix) {
    // Add suffix to prevent possible conflict with native apps
    name += `-${suffix}`
  }

  if (process.platform === 'darwin') {
    return macos(name)
  }

  if (process.platform === 'win32') {
    return windows(name)
  }

  return linux(name)
}

export default class AppPath {
  public static async ensureAppStructure() {
    const dirs = [
      this.data,
      this.config,
      this.cache,
      this.log,
      this.temp,
      this.worlds,
      this.systems,
      this.modules,
      this.assets,
    ]

    await AppFS.ensureDirsExist(dirs)

    return dirs
  }

  public static get data() {
    return envPaths('Squire').data
  }

  public static get config() {
    return envPaths('Squire').config
  }

  public static get cache() {
    return envPaths('Squire').cache
  }

  public static get log() {
    return envPaths('Squire').log
  }

  public static get temp() {
    return envPaths('Squire').temp
  }

  public static get all() {
    return {
      ...envPaths('Squire'),
      worlds: this.worlds,
      systems: this.systems,
      modules: this.modules,
    }
  }

  public static get worlds() {
    return path.join(this.data, 'worlds')
  }

  public static get systems() {
    return path.join(this.data, 'systems')
  }

  public static get modules() {
    return path.join(this.data, 'modules')
  }

  public static get assets() {
    return path.join(this.data, 'assets')
  }

  public static worldPath(world: string) {
    return path.join(this.worlds, world)
  }

  public static systemPath(system: string) {
    return path.join(this.systems, system)
  }

  public static modulePath(module: string) {
    return path.join(this.modules, module)
  }

  public static assetPath(asset: string) {
    return path.join(this.assets, asset)
  }

  public static async checkSystemExists(systemName: string) {
    const finalPath = this.systemPath(systemName)

    const exists = await AppFS.checkPathExists(finalPath)

    if (!exists) {
      return false
    }

    const manifest = await AppFS.readJson<{
      compatibility: {
        min: string
        max: string
      }
    }>(path.join(finalPath, 'world.json'))

    if (!manifest) {
      return false
    }

    const FAKE_CURRENT_VERSION = '1.3.0'

    return Utils.isVersionInRange(
      FAKE_CURRENT_VERSION,
      manifest.compatibility.min,
      manifest.compatibility.max
    )
  }
}
