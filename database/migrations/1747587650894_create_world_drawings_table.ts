import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'drawings'

  async up() {
    await this.schema.dropTableIfExists(this.tableName)

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('scene_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('scenes')
        .onDelete('CASCADE')
        .index()

      table.string('name').notNullable()
      table.string('description').nullable()

      table
        .enum('type', ['rectangle', 'circle', 'polygon', 'freehand', 'text', 'line', 'sprite'])
        .notNullable()

      table.json('options').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
