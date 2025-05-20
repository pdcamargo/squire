import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const systemSchema = vine.compile(
  vine.object({
    id: vine.string().trim(),
    name: vine.string().trim(),
    description: vine.string().trim(),
    cover: vine.string().trim().optional().nullable(),
    createdAt: vine.string().trim(),
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
    tags: vine.array(vine.string().trim()).optional(),
  })
)

export type SystemType = Infer<typeof systemSchema>
