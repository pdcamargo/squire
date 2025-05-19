import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const sceneSchema = vine.compile(
  vine.object({
    id: vine.number({ strict: true }).withoutDecimals(),
    name: vine.string().trim(),
    description: vine.string().trim().optional().nullable(),
    backgroundColor: vine.string().trim().optional().nullable(),
    backgroundImage: vine.string().trim().optional().nullable(),
    gridSize: vine.number({ strict: true }).withoutDecimals().optional(),
    gridLineColor: vine.string().trim().optional().nullable(),
    gridLineAlpha: vine.number({ strict: true }).optional(),
    gridLineWidth: vine.number({ strict: true }).optional(),
    gridSubLineColor: vine.string().trim().optional().nullable(),
    gridSubLineAlpha: vine.number({ strict: true }).optional(),
    gridSubLineWidth: vine.number({ strict: true }).optional(),
    worldSize: vine.object({
      width: vine.number({ strict: true }).withoutDecimals(),
      height: vine.number({ strict: true }).withoutDecimals(),
    }),
  })
)

export type SceneType = Infer<typeof sceneSchema>
