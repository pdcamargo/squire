import * as PIXI from 'pixi.js'

import { CircleDrawingOptions } from '#validators/drawing'

export class Circle extends PIXI.Graphics {
  constructor(private options: CircleDrawingOptions) {
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
    this.circle(this.options.x, this.options.y, this.options.radius)
    this.fill()
  }
}
