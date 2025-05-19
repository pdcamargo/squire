import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import WorldDrawing from '#models/world_drawing'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class WorldScene extends BaseModel {
  static table = 'scenes'
  static connection = 'world'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare backgroundColor: string | null

  @column()
  declare backgroundImage: string | null

  @column()
  declare gridSize: number

  @column()
  declare gridLineColor: string | null

  @column()
  declare gridLineAlpha: number

  @column()
  declare gridLineWidth: number

  @column()
  declare gridSubLineColor: string | null

  @column()
  declare gridSubLineAlpha: number

  @column()
  declare gridSubLineWidth: number

  @column({
    prepare: (value: any) => {
      return JSON.stringify(value)
    },
    serialize: (value: any) => {
      return JSON.parse(value)
    },
  })
  declare worldSize: {
    width: number
    height: number
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => WorldDrawing, {
    foreignKey: 'sceneId',
  })
  declare drawings: HasMany<typeof WorldDrawing>
}
