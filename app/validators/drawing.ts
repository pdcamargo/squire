import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const rectDrawingOptionsSchema = {
  options: vine.object({
    x: vine.number(),
    y: vine.number(),
    width: vine.number(),
    height: vine.number(),
    fillColor: vine.string().optional(),
    lineWidth: vine.number().optional(),
    lineColor: vine.string().optional(),
    lineAlpha: vine.number().optional(),
    alpha: vine.number().optional(),
    rotation: vine.number().optional(),
  }),
}

export const circleDrawingOptionsSchema = {
  options: vine.object({
    x: vine.number(),
    y: vine.number(),
    radius: vine.number(),
    fillColor: vine.string().optional(),
    lineWidth: vine.number().optional(),
    lineColor: vine.string().optional(),
    lineAlpha: vine.number().optional(),
    alpha: vine.number().optional(),
    rotation: vine.number().optional(),
  }),
}

export const polygonDrawingOptionsSchema = {
  options: vine.object({
    points: vine.array(vine.number()),
    fillColor: vine.string().optional(),
    lineWidth: vine.number().optional(),
    lineColor: vine.string().optional(),
    lineAlpha: vine.number().optional(),
    alpha: vine.number().optional(),
  }),
}

export const freehandDrawingOptionsSchema = {
  options: vine.object({
    points: vine.array(vine.number()),
    fillColor: vine.string().optional(),
    lineWidth: vine.number().optional(),
    lineColor: vine.string().optional(),
    lineAlpha: vine.number().optional(),
    alpha: vine.number().optional(),
  }),
}

export const textDrawingOptionsSchema = {
  options: vine.object({
    text: vine.string(),
    fontSize: vine.number(),
    fillColor: vine.string().optional(),
    lineWidth: vine.number().optional(),
    lineColor: vine.string().optional(),
    lineAlpha: vine.number().optional(),
    alpha: vine.number().optional(),
    rotation: vine.number().optional(),
  }),
}

export const lineDrawingOptionsSchema = {
  options: vine.object({
    x1: vine.number(),
    y1: vine.number(),
    x2: vine.number(),
    y2: vine.number(),
    lineWidth: vine.number().optional(),
    lineColor: vine.string().optional(),
    lineAlpha: vine.number().optional(),
    alpha: vine.number().optional(),
  }),
}

export const spriteDrawingOptionsSchema = {
  options: vine.object({
    x: vine.number(),
    y: vine.number(),
    width: vine.number(),
    height: vine.number(),
    alpha: vine.number().optional(),
    rotation: vine.number().optional(),
    src: vine.string(),
  }),
}

const optionsGroup = vine.group([
  vine.group.if((data) => data.type === 'rectangle', rectDrawingOptionsSchema),
  vine.group.if((data) => data.type === 'circle', circleDrawingOptionsSchema),
  vine.group.if((data) => data.type === 'polygon', polygonDrawingOptionsSchema),
  vine.group.if((data) => data.type === 'freehand', freehandDrawingOptionsSchema),
  vine.group.if((data) => data.type === 'text', textDrawingOptionsSchema),
  vine.group.if((data) => data.type === 'line', lineDrawingOptionsSchema),
  vine.group.if((data) => data.type === 'sprite', spriteDrawingOptionsSchema),
])

export const drawingSchema = vine.compile(
  vine
    .object({
      id: vine.number(),
      sceneId: vine.number(),
      name: vine.string(),
      description: vine.string().nullable(),
      type: vine.string(),
    })
    .merge(optionsGroup)
)

export type DrawingType = Infer<typeof drawingSchema>

export type RectDrawingOptions = Infer<(typeof rectDrawingOptionsSchema)['options']>
export type CircleDrawingOptions = Infer<(typeof circleDrawingOptionsSchema)['options']>
export type PolygonDrawingOptions = Infer<(typeof polygonDrawingOptionsSchema)['options']>
export type FreehandDrawingOptions = Infer<(typeof freehandDrawingOptionsSchema)['options']>
export type TextDrawingOptions = Infer<(typeof textDrawingOptionsSchema)['options']>
export type LineDrawingOptions = Infer<(typeof lineDrawingOptionsSchema)['options']>
export type SpriteDrawingOptions = Infer<(typeof spriteDrawingOptionsSchema)['options']>
