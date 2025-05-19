import Handlebars from 'handlebars'
import { makeAutoObservable, toJS } from 'mobx'
import * as PIXI from 'pixi.js'

import { drawingSchema, DrawingType } from '#validators/drawing'
import { SceneType } from '#validators/scene'

import { loadScript } from '@/lib/utils'
import { Camera } from '@/pixi/camera'
import { Circle } from '@/pixi/circle'
import { Grid, GridUpdateOptions } from '@/pixi/grid'
import { Rect } from '@/pixi/rect'
import { Sprite } from '@/pixi/sprite'

export class SDKScene {
  constructor(
    private readonly sdk: SquireSDK,
    private readonly data: SceneType & {
      drawings: Array<DrawingType>
    }
  ) {
    makeAutoObservable(this, undefined, { autoBind: true })

    this.render()
  }

  public get id() {
    return this.data.id
  }

  public get name() {
    return this.data.name
  }

  public async render() {
    // const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png')
    // const bunny = new PIXI.Sprite(texture)
    // bunny.anchor.set(0.5)
    // bunny.x = this.sdk.canvasController.viewport.width / 2
    // bunny.y = this.sdk.canvasController.viewport.height / 2

    // this.sdk.canvasController.stage.addChild(bunny)
    for (const drawing of this.data.drawings) {
      const options = await drawingSchema.validate(toJS(drawing))

      if (drawing.type === 'rectangle') {
        const rect = new Rect(options.options as any)

        this.sdk.canvasController.stage.addChild(rect)

        continue
      }

      if (drawing.type === 'circle') {
        const circle = new Circle(options.options as any)

        this.sdk.canvasController.stage.addChild(circle)

        continue
      }

      if (drawing.type === 'sprite') {
        const sprite = new Sprite(options.options as any)

        this.sdk.canvasController.stage.addChild(sprite)

        continue
      }
    }
  }
}

class SDKCanvasController {
  public application: PIXI.Application

  grid!: Grid
  stage!: PIXI.Container

  constructor(public readonly sdk: SquireSDK) {
    makeAutoObservable(
      this,
      {
        application: false,
        grid: false,
        sdk: false,
        stage: false,
      },
      { autoBind: true }
    )

    this.application = new PIXI.Application()
  }

  public get viewport() {
    return this.application.renderer.screen
  }

  public async init(options: { background: string; resizeTo: HTMLElement }) {
    const container = options.resizeTo!

    await this.application.init({
      background: options.background,
      resizeTo: container,
    })

    const resizeObserver = new ResizeObserver(() => {
      this.application.renderer.resize(container.clientWidth, container.clientHeight)
    })

    resizeObserver.observe(container)

    container.appendChild(this.application.canvas)

    const camera = new Camera({
      // application: this.application,
      viewportWidth: container.clientWidth,
      viewportHeight: container.clientHeight,
      worldWidth: 1920,
      worldHeight: 1080,
      clamp: false,
      // events: this.application.renderer.events,
      // screenWidth: container.clientWidth,
      // screenHeight: container.clientHeight,
    })

    camera.enableWheel(this.application)

    const cameraRootContainer = new PIXI.Container()

    camera.addChild(cameraRootContainer)

    const gridContainer = new PIXI.Container({
      zIndex: 0,
    })

    const grid = new Grid({
      width: 1920,
      height: 1080,
    })

    this.grid = grid

    gridContainer.addChild(grid)

    cameraRootContainer.addChild(gridContainer)

    this.application.stage.addChild(camera)

    const appContainer = new PIXI.Container({
      zIndex: 1,
    })

    cameraRootContainer.addChild(appContainer)

    this.stage = appContainer

    this.application.ticker.add(({ deltaMS }) => {
      camera.update(deltaMS)
    })
  }

  public updateBackground(color: string) {
    this.application.renderer.background.color = new PIXI.Color(color)
  }

  public updateGrid(options: GridUpdateOptions) {
    this.grid.updateGrid(options)
  }
}

export class SquireSDK {
  public scenes: SceneType[] = []
  private views: Record<string, string> = {}
  public scripts: string[] = []

  public currentScene: SDKScene | null = null

  public canvasController: SDKCanvasController

  constructor(
    private options: { scripts: string[]; views: Record<string, string>; scenes: SceneType[] }
  ) {
    makeAutoObservable(this, undefined, { autoBind: true })

    this.scenes = options.scenes
    this.views = options.views
    this.scripts = options.scripts

    this.canvasController = new SDKCanvasController(this)

    this.#init()
  }

  public setCurrentScene(scene: SceneType & { drawings: Array<DrawingType> }) {
    this.canvasController.stage.removeChildren()

    this.canvasController.updateGrid({
      tileSize: scene.gridSize,
      lineColor: scene.gridLineColor
        ? new PIXI.Color(scene.gridLineColor).toBgrNumber()
        : undefined,
      lineWidth: scene.gridLineWidth,
      lineAlpha: scene.gridLineAlpha,
      subLineColor: scene.gridSubLineColor
        ? new PIXI.Color(scene.gridSubLineColor).toBgrNumber()
        : undefined,
      subLineWidth: scene.gridSubLineWidth,
      subLineAlpha: scene.gridSubLineAlpha,
      worldSize: scene.worldSize,
      backgroundColor: scene.backgroundColor || undefined,
    })

    this.currentScene = new SDKScene(this, scene)
  }

  #loadScripts = async () => {
    Promise.all(
      this.options.scripts.map(async (script) => {
        try {
          await loadScript(script)
          console.log(`Script ${script} loaded`)
        } catch (error) {
          console.error(error)
        }
      })
    )
  }

  #init = async () => {
    if (typeof window === 'undefined') {
      return
    }

    if (this.views && Object.keys(this.views).length > 0) {
      Object.entries(this.views).forEach(([name, view]) => {
        Handlebars.registerPartial(name, view)
      })
    }

    this.canvasController.init({
      background: '#000000',
      resizeTo: document.querySelector<HTMLDivElement>('[data-id="canvas-container"]')!,
    })

    {
      ;(window as any).Squire = this
    }

    // Initialize the SDK
    await this.#loadScripts()

    console.log('Squire SDK initialized')
  }
}
