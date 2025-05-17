import { Container, Graphics, ContainerOptions, Rectangle, Color } from 'pixi.js'

export type GridOptions = ContainerOptions & {
  tileSize?: number
  rows?: number
  columns?: number
  lineColor?: number
  lineWidth?: number
  lineAlpha?: number
  subLineColor?: number
  subLineWidth?: number
  subLineAlpha?: number
}

export class Grid extends Container {
  #tileSize: number
  #rows: number
  #columns: number
  #lineColor: number
  #lineWidth: number
  #lineAlpha: number
  #subLineColor: number
  #subLineWidth: number
  #subLineAlpha: number

  constructor({
    tileSize,
    rows,
    columns,
    lineColor,
    lineWidth,
    lineAlpha,
    subLineColor,
    subLineWidth,
    subLineAlpha,
    ...options
  }: GridOptions = {}) {
    super(options)

    this.#tileSize = tileSize || 50
    this.#rows = rows || 100
    this.#columns = columns || 100
    this.#lineColor = lineColor ?? new Color('#0f0f0f').toBgrNumber()
    this.#lineWidth = lineWidth ?? 1
    this.#lineAlpha = lineAlpha ?? 1
    this.#subLineColor = subLineColor ?? new Color('#000').toBgrNumber()
    this.#subLineWidth = subLineWidth ?? 1
    this.#subLineAlpha = subLineAlpha ?? 0.1

    this.#drawGrid()
  }

  #drawGrid() {
    const graphics = new Graphics()

    const width = this.#columns * this.#tileSize
    const height = this.#rows * this.#tileSize
    const halfW = width / 2
    const halfH = height / 2
    const mainStep = this.#tileSize
    const subStep = this.#tileSize / 2

    // draw sub-lines (minor at half-step intervals between main)
    graphics.setStrokeStyle({
      width: this.#subLineWidth,
      color: this.#subLineColor,
      alpha: this.#subLineAlpha,
    })
    graphics.beginPath()
    const subCountX = this.#columns * 2
    for (let i = 0; i <= subCountX; i++) {
      if (i % 2 === 0) continue // skip major
      const x = -halfW + i * subStep
      graphics.moveTo(x, -halfH)
      graphics.lineTo(x, halfH)
    }
    const subCountY = this.#rows * 2
    for (let i = 0; i <= subCountY; i++) {
      if (i % 2 === 0) continue
      const y = -halfH + i * subStep
      graphics.moveTo(-halfW, y)
      graphics.lineTo(halfW, y)
    }
    graphics.stroke()
    graphics.closePath()
    graphics.beginPath()

    // draw main grid lines
    graphics.setStrokeStyle({
      width: this.#lineWidth,
      color: this.#lineColor,
      alpha: this.#lineAlpha,
    })
    graphics.beginPath()
    const mainCountX = this.#columns
    for (let i = 0; i <= mainCountX; i++) {
      const x = -halfW + i * mainStep
      graphics.moveTo(x, -halfH)
      graphics.lineTo(x, halfH)
    }
    const mainCountY = this.#rows
    for (let i = 0; i <= mainCountY; i++) {
      const y = -halfH + i * mainStep
      graphics.moveTo(-halfW, y)
      graphics.lineTo(halfW, y)
    }
    graphics.stroke()

    this.addChild(graphics)
  }
}
