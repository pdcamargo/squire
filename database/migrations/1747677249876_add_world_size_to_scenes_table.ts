import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scenes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .json('world_size')
        .nullable()
        .defaultTo(JSON.stringify({ width: 0, height: 0 }))
    })

    this.defer(async (db) => {
      const rows = await db.from(this.tableName).select('id', 'grid_rows', 'grid_columns')

      for (const row of rows) {
        const worldSize = {
          width: row.grid_columns * 100,
          height: row.grid_rows * 100,
        }

        await db
          .from(this.tableName)
          .where('id', row.id)
          .update({ world_size: JSON.stringify(worldSize) })
      }
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('world_size')
    })
  }
}
