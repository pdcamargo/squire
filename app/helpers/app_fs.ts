import fs from 'node:fs/promises'

export default class AppFS {
  /**
   * Generically used to ensure that a directory exists.
   *
   * Note: This function will never throw an error
   *
   * @param {string} dir - The directory to ensure exists.
   */
  public static async ensureDirExists(dir: string) {
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch {
      // Ignore errors
    }
  }

  /**
   * Ensures that all directories in the provided array exist.
   *
   * Note: This function will never throw an error
   */
  public static async ensureDirsExist(dirs: string[]) {
    for (const dir of dirs) {
      await this.ensureDirExists(dir)
    }
  }

  /**
   * Checks if a file or directory exists at the given path.
   *
   * Note: This function will never throw an error
   */
  public static async checkPathExists(filePath: string) {
    try {
      await fs.access(filePath, fs.constants.F_OK)

      return true
    } catch (error) {
      return false
    }
  }

  public static async getDirContents(dirPath: string) {
    try {
      const dirents = await fs.readdir(dirPath, { withFileTypes: true })

      return dirents
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .map((dirent) => `${dirPath}/${dirent}`)
    } catch {
      return []
    }
  }

  public static async readJson<T>(filePath: string): Promise<T | null> {
    if (!this.checkPathExists(filePath)) {
      return null
    }

    try {
      const data = await fs.readFile(filePath, 'utf-8')

      return JSON.parse(data)
    } catch {
      return null
    }
  }

  public static async writeFile(filePath: string, data: string) {
    await fs.writeFile(filePath, data, 'utf-8')
  }
}
