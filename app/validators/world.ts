import vine from '@vinejs/vine'

export const createWorldSchema = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(50),
    description: vine.string().trim().minLength(3).maxLength(255).optional().nullable(),
    system: vine.string().trim(),
  })
)
