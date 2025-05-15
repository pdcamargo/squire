import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * name, username, optional password
       */
      table.string('name').notNullable()
      table.string('username').notNullable()
      table.string('password').nullable().defaultTo(null)
      table.string('avatar').nullable().defaultTo(null)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
