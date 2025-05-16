import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const systemSchema = vine.compile(
  vine.object({
    id: vine.string().trim(),
    name: vine.string().trim(),
    compatibility: vine.object({
      min: vine.string().trim(),
      max: vine.string().trim(),
    }),
    paths: vine
      .object({
        views: vine.string().trim().optional().nullable(),
        scripts: vine.string().trim().optional().nullable(),
      })
      .optional(),
  })
)

export type SystemType = Infer<typeof systemSchema>
