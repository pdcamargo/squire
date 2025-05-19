import path from 'node:path'

import AppFS from '#helpers/app_fs'
import AppPath from '#helpers/app_path'
import Utils from '#helpers/utils'
import { SystemType } from '#validators/system'

export default class SystemHelper {
  public static async listSystems() {
    await AppPath.ensureAppStructure()

    const worlds = await AppFS.getDirFolders(AppPath.systems)

    const res = await Promise.all(
      worlds.map(async (world: string) => {
        const manifests = await SystemHelper.readSystemManifest(path.basename(world))

        if (!manifests) {
          return null
        }

        return {
          ...manifests,
        } as const
      })
    )

    return res.filter((system): system is SystemType => system !== null)
  }

  public static async readSystemManifest(system: string) {
    const systemPath = AppPath.systemPath(system)
    const systemManifest = await AppFS.readJson<SystemType>(AppPath.join(systemPath, 'system.json'))
    if (!systemManifest) {
      return null
    }

    // TODO: handle system compatibility
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

    return systemManifest
  }
}
