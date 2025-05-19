import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import WorldScene from '#models/world_scene'

export default class WorldDrawing extends BaseModel {
  static table = 'drawings'
  static connection = 'world'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sceneId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare type: 'rectangle' | 'circle' | 'polygon' | 'freehand' | 'text' | 'line'

  @column({
    prepare: (value: any) => {
      return JSON.stringify(value)
    },
    serialize: (value: any) => {
      return JSON.parse(value)
    },
  })
  declare options: {
    [key: string]: any
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => WorldScene, {
    foreignKey: 'sceneId',
  })
  declare scene: BelongsTo<typeof WorldScene>
}
