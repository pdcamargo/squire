import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'scenes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name').notNullable()
      table.string('description').nullable()
      table.string('background_color').nullable()
      table.string('background_image').nullable()
      table.integer('grid_size').notNullable()
      table.integer('grid_rows').notNullable()
      table.integer('grid_columns').notNullable()
      table.string('grid_line_color').nullable()
      table.float('grid_line_alpha').notNullable()
      table.float('grid_line_width').notNullable()
      table.string('grid_sub_line_color').nullable()
      table.float('grid_sub_line_alpha').notNullable()
      table.float('grid_sub_line_width').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
