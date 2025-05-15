import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('maximum_fps').defaultTo(60)
      table.boolean('show_fps_meter').defaultTo(false)
      table.enu('performance_mode', ['high', 'medium', 'low', 'max']).defaultTo('medium')
      table.string('language_preference').defaultTo('en')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
