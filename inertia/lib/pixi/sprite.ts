import * as PIXI from 'pixi.js'

import { SpriteDrawingOptions } from '#validators/drawing'

export class Sprite extends PIXI.Sprite {
  constructor(private options: SpriteDrawingOptions) {
    super({
      x: options.x,
      y: options.y,
    })

    this.#render()
  }

  #render = async () => {
    const texture = await PIXI.Assets.load(this.options.src)
    this.texture = texture
    this.anchor.set(0.5)
    this.x = this.options.x
    this.y = this.options.y
    this.width = this.options.width
    this.height = this.options.height
    this.alpha = this.options.alpha ?? 1
    this.rotation = this.options.rotation ?? 0
  }
}
