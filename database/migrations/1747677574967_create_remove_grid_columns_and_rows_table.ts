import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scenes'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('grid_rows')
      table.dropColumn('grid_columns')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('grid_rows').notNullable().defaultTo(10)
      table.integer('grid_columns').notNullable().defaultTo(10)
    })
  }
}
