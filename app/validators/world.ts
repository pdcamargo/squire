import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createWorldSchema = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(50),
    description: vine.string().trim().minLength(3).maxLength(255).optional().nullable(),
    system: vine.string().trim(),
  })
)

export const worldSchema = vine.compile(
  vine.object({
    id: vine.string().trim(),
    name: vine.string().trim().minLength(3).maxLength(50),
    description: vine.string().trim().minLength(3).maxLength(255).optional().nullable(),
    system: vine.string().trim(),
    lastPlayed: vine.string().trim(),
    lastUpdated: vine.string().trim(),
    createdAt: vine.string().trim(),
    tags: vine.array(vine.string().trim()).optional(),
  })
)
export type WorldType = Infer<typeof worldSchema>
