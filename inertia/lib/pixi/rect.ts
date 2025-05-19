import * as PIXI from 'pixi.js'

import { RectDrawingOptions } from '#validators/drawing'

export class Rect extends PIXI.Graphics {
  constructor(private options: RectDrawingOptions) {
    super({
      x: options.x,
      y: options.y,
    })

    this.#render()
  }

  #render = () => {
    this.clear()
    this.fill({
      color: this.options.fillColor,
      alpha: this.options.alpha,
    })

    this.setStrokeStyle({
      width: this.options.lineWidth,
      color: this.options.lineColor,
      alpha: this.options.lineAlpha,
    })
    this.rect(this.options.x, this.options.y, this.options.width, this.options.height)
    this.fill()
  }
}
