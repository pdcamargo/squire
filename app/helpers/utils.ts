export default class Utils {
  /**
   * Turn a “x.y.z” string into a [major, minor, patch] tuple of numbers.
   * Missing or non-numeric parts default to 0.
   */
  public static parseVersion(version: string) {
    return version.split('.').map((n) => Number(n) || 0) as [number, number, number]
  }

  /**
   * Compare two [major, minor, patch] tuples.
   * Returns 1 if a > b, 0 if equal, -1 if a < b.
   */
  public static compareVersions(a: [number, number, number], b: [number, number, number]) {
    for (let i = 0; i < 3; i++) {
      if (a[i] > b[i]) return 1
      if (a[i] < b[i]) return -1
    }
    return 0
  }

  /**
   * Returns true if version ∈ [minVersion, maxVersion], inclusive.
   */
  public static isVersionInRange(version: string, minVersion: string, maxVersion: string) {
    const v = this.parseVersion(version)
    const minV = this.parseVersion(minVersion)
    const maxV = this.parseVersion(maxVersion)

    return this.compareVersions(v, minV) >= 0 && this.compareVersions(v, maxV) <= 0
  }
}
