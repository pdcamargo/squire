import vine, { SimpleMessagesProvider } from '@vinejs/vine'
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

export const createSystemSchema = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    description: vine.string().trim().minLength(1),
    cover: vine.string().trim().optional().nullable(),
    compatibility: vine.object({
      min: vine
        .string()
        .trim()
        .regex(
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/
        ),
      max: vine
        .string()
        .trim()
        .regex(
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/
        ),
    }),
    tags: vine.array(vine.string().trim()).optional().nullable(),
  })
)

createSystemSchema.messagesProvider = new SimpleMessagesProvider({
  regex: 'The {{ field }} field must be in semver format (x.x.x)',
})

export type SystemType = Infer<typeof systemSchema>
