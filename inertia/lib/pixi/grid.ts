import { Container, Graphics, ContainerOptions, Color, Ticker } from 'pixi.js'

export type GridOptions = ContainerOptions & {
  tileSize?: number
  lineColor?: number | string | Color
  lineWidth?: number
  lineAlpha?: number
  subLineColor?: number | string | Color
  backgroundColor?: number | string | Color
  subLineWidth?: number
  subLineAlpha?: number
  worldSize?: {
    width: number
    height: number
  }
}

export type GridUpdateOptions = Omit<GridOptions, keyof ContainerOptions>

export class Grid extends Container {
  #tileSize!: number
  #rows!: number
  #columns!: number
  #lineColor!: number
  #lineWidth!: number
  #lineAlpha!: number
  #subLineColor!: number
  #subLineWidth!: number
  #subLineAlpha!: number
  #backgroundColor!: number
  #worldSize!: { width: number; height: number }
  #lastSpacing: number = 0

  constructor({
    tileSize,
    lineColor,
    lineWidth,
    lineAlpha,
    subLineColor,
    subLineWidth,
    subLineAlpha,
    worldSize,
    backgroundColor,
    ...options
  }: GridOptions = {}) {
    super(options)

    this.updateGrid({
      tileSize: tileSize || 50,
      lineColor: lineColor || new Color(0xaaaaaa),
      lineWidth: lineWidth ?? 1,
      lineAlpha: lineAlpha ?? 1,
      subLineColor: subLineColor || new Color(0xaaaaaa),
      subLineWidth: subLineWidth ?? 1,
      subLineAlpha: subLineAlpha ?? 1,
      worldSize: worldSize || { width: 500, height: 500 },
      backgroundColor: backgroundColor || new Color(0xa1a),
    })

    // Redraw grid automatically when zoom level changes, to keep lines crisp
    Ticker.shared.add(this._onTick, this)
  }

  public updateGrid(options: GridUpdateOptions) {
    this.#tileSize = options.tileSize || this.#tileSize

    this.#lineColor = (() => {
      const val = options.lineColor ?? this.#lineColor
      if (typeof val === 'string') return new Color(val).toBgrNumber()
      if (val instanceof Color) return val.toBgrNumber()
      return val
    })()
    this.#subLineColor = (() => {
      const val = options.subLineColor ?? this.#subLineColor
      if (typeof val === 'string') return new Color(val).toBgrNumber()
      if (val instanceof Color) return val.toBgrNumber()
      return val
    })()

    this.#lineWidth = options.lineWidth ?? this.#lineWidth
    this.#lineAlpha = options.lineAlpha ?? this.#lineAlpha
    this.#subLineWidth = options.subLineWidth ?? this.#subLineWidth
    this.#subLineAlpha = options.subLineAlpha ?? this.#subLineAlpha
    this.#worldSize = options.worldSize || this.#worldSize

    this.#rows = Math.ceil(this.#worldSize.height / this.#tileSize)
    this.#columns = Math.ceil(this.#worldSize.width / this.#tileSize)
    this.#backgroundColor = (() => {
      const val = options.backgroundColor ?? this.#backgroundColor
      if (typeof val === 'string') return new Color(val).toBgrNumber()
      if (val instanceof Color) return val.toBgrNumber()
      return val
    })()

    this.#drawGrid()
  }

  #drawGrid() {
    // Determine current world scale (camera zoom) to snap spacing to pixel grid
    const worldScale = this.worldTransform.a
    // Calculate desired screen-space step in pixels, then snap to integer
    const mainStepPx = Math.max(1, Math.round(this.#tileSize * worldScale))
    // Convert back to world units for drawing
    const mainStep = mainStepPx / worldScale
    const subStep = mainStep / 2

    this.removeChildren()
    const graphics = new Graphics()

    // fill background
    if (this.#backgroundColor) {
      graphics.rect(
        -this.#worldSize.width / 2,
        -this.#worldSize.height / 2,
        this.#worldSize.width,
        this.#worldSize.height
      )
      graphics.fill(this.#backgroundColor)
    }

    const width = this.#columns * this.#tileSize
    const height = this.#rows * this.#tileSize
    const halfW = width / 2
    const halfH = height / 2

    // minor sub-lines
    graphics.setStrokeStyle({
      width: this.#subLineWidth,
      color: this.#subLineColor,
      alpha: this.#subLineAlpha,
    })
    graphics.beginPath()
    const subCountX = Math.ceil(width / subStep)
    for (let i = 1; i < subCountX; i++) {
      if (i % 2 === 0) continue
      const x = -halfW + i * subStep
      graphics.moveTo(x, -halfH)
      graphics.lineTo(x, halfH)
    }
    const subCountY = Math.ceil(height / subStep)
    for (let i = 1; i < subCountY; i++) {
      if (i % 2 === 0) continue
      const y = -halfH + i * subStep
      graphics.moveTo(-halfW, y)
      graphics.lineTo(halfW, y)
    }
    graphics.stroke()

    // main grid lines
    graphics.setStrokeStyle({
      width: this.#lineWidth,
      color: this.#lineColor,
      alpha: this.#lineAlpha,
    })
    graphics.beginPath()
    const mainCountX = Math.ceil(width / mainStep)
    for (let i = 0; i <= mainCountX; i++) {
      const x = -halfW + i * mainStep
      graphics.moveTo(x, -halfH)
      graphics.lineTo(x, halfH)
    }
    const mainCountY = Math.ceil(height / mainStep)
    for (let i = 0; i <= mainCountY; i++) {
      const y = -halfH + i * mainStep
      graphics.moveTo(-halfW, y)
      graphics.lineTo(halfW, y)
    }
    graphics.stroke()
    graphics.closePath()

    this.addChild(graphics)
  }

  private _onTick() {
    // Redraw if spacing snapped to a different pixel grid
    const worldScale = this.worldTransform.a
    const mainStepPx = Math.max(1, Math.round(this.#tileSize * worldScale))
    if (mainStepPx !== this.#lastSpacing) {
      this.#lastSpacing = mainStepPx
      this.#drawGrid()
    }
  }
}
