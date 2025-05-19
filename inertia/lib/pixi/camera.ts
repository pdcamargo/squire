import { Container, Rectangle, Point, Application, FederatedPointerEvent } from 'pixi.js'

interface CameraOptions {
  worldWidth: number
  worldHeight: number
  viewportWidth: number
  viewportHeight: number
  clamp?: boolean
  dragButton?: number // which mouse button initiates drag (0=left, 1=middle, 2=right)
  wheelScrollSpeed?: number // scroll wheel zoom sensitivity (multiplicative factor)
  pinchZoomSpeed?: number // pinch-zoom sensitivity factor
  keySpeed?: number // keyboard move speed in pixels per frame (at scale=1)
}

export class Camera extends Container {
  worldWidth: number
  worldHeight: number
  clamp: boolean
  dragButton: number
  wheelScrollSpeed: number
  pinchZoomSpeed: number
  keySpeed: number

  private _dragging: boolean = false
  private _dragPointerId: number | null = null
  private _lastDragPos: Point = new Point()
  private _pointers: Map<number, Point> = new Map() // active pointers for multitouch
  private _pinchActive: boolean = false
  private _initialPinchDist: number = 0
  private _initialPinchCenter: Point = new Point()
  private _keys: { [key: string]: boolean } = {}
  private _viewportWidth: number
  private _viewportHeight: number

  constructor(options: CameraOptions) {
    super({ isRenderGroup: true, interactive: true, interactiveChildren: true }) // enable render group for GPU-accelerated transforms

    const { worldWidth, worldHeight, viewportHeight, viewportWidth } = options

    // Set up properties
    this.worldWidth = options.worldWidth ?? worldWidth
    this.worldHeight = options.worldHeight ?? worldHeight
    this.clamp = options.clamp ?? true
    this.dragButton = options.dragButton ?? 1 // default: middle mouse button
    this.wheelScrollSpeed = options.wheelScrollSpeed ?? 1.0
    this.pinchZoomSpeed = options.pinchZoomSpeed ?? 1.0
    this.keySpeed = options.keySpeed ?? 5.0
    this._viewportWidth = viewportWidth
    this._viewportHeight = viewportHeight

    // Enable interaction on the camera
    this.eventMode = 'static' // will emit pointer events and do hit-testing on itself
    // Define a hitArea covering the entire viewport (or world). Using a very large rectangle to simulate infinite area.
    this.hitArea = new Rectangle(
      -Number.MAX_VALUE / 2,
      -Number.MAX_VALUE / 2,
      Number.MAX_VALUE,
      Number.MAX_VALUE
    )
    // (We use finite large numbers because using Infinity in hitArea could cause NaN issues.)

    // Pointer event handlers for dragging and pinch
    this.on('pointerdown', this.onPointerDown, this)
    this.on('pointermove', this.onPointerMove, this)
    this.on('pointerup', this.onPointerUp, this)
    this.on('pointerupoutside', this.onPointerUp, this)

    // Keyboard event listeners for arrows
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
  }

  /** Enable scroll-wheel zoom by attaching an event listener to the application's view (canvas) */
  enableWheel(app: Application): void {
    app.canvas.addEventListener('wheel', this.onWheel.bind(this))
  }

  private onPointerDown(e: FederatedPointerEvent): void {
    const pointerId = e.pointerId
    this._pointers.set(pointerId, new Point(e.global.x, e.global.y))
    if (e.pointerType === 'mouse') {
      if (e.pointerId === this.dragButton) {
        // Start dragging with mouse
        this._dragging = true
        this._dragPointerId = pointerId
        this._lastDragPos.set(e.global.x, e.global.y)
        e.preventDefault() // prevent middle-click scrolling or other defaults
      }
    } else if (e.pointerType === 'touch') {
      if (this._pointers.size === 1) {
        // Single touch start -> begin drag
        this._dragging = true
        this._dragPointerId = pointerId
        this._lastDragPos.set(e.global.x, e.global.y)
      } else if (this._pointers.size === 2) {
        // Two touches -> begin pinch zoom
        this._pinchActive = true
        const [p1, p2] = Array.from(this._pointers.values())
        this._initialPinchDist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
        this._initialPinchCenter.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
      }
    }
  }

  private onPointerMove(e: FederatedPointerEvent): void {
    const pointerId = e.pointerId
    if (this._pinchActive && this._pointers.size >= 2) {
      // Update stored position of this pointer
      if (this._pointers.has(pointerId)) {
        this._pointers.get(pointerId)!.set(e.global.x, e.global.y)
      }
      // Handle pinch if two pointers are still active
      if (this._pointers.size === 2) {
        const [p1, p2] = Array.from(this._pointers.values())
        const newDist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
        if (this._initialPinchDist > 0) {
          const scaleChange = (newDist / this._initialPinchDist) * this.pinchZoomSpeed
          const newScale = this.scale.x * scaleChange
          // Perform zoom around the initial pinch center point
          this.zoomAroundPoint(this._initialPinchCenter, newScale)
          // Update baseline for next event
          this._initialPinchDist = newDist
          this._initialPinchCenter.set((p1.x + p2.x) / 2, (p1.y + p2.y) / 2)
        }
      }
    } else if (this._dragging && pointerId === this._dragPointerId) {
      // Mouse drag or single-touch drag
      const newPos = e.global // current pointer position in global (screen) coords
      const dx = newPos.x - this._lastDragPos.x
      const dy = newPos.y - this._lastDragPos.y
      this.x += dx
      this.y += dy
      this._lastDragPos.copyFrom(newPos)

      if (this.clamp) this.clampPosition()
      e.preventDefault()
    }
  }

  private onPointerUp(e: FederatedPointerEvent): void {
    const pointerId = e.pointerId
    this._pointers.delete(pointerId)
    if (this._pinchActive) {
      // If a pinch was in progress, end it when pointers go < 2
      if (this._pointers.size < 2) {
        this._pinchActive = false
        // If one finger remains, continue dragging with that finger
        if (this._pointers.size === 1) {
          const [remainingId] = this._pointers.keys()
          this._dragPointerId = remainingId
          this._dragging = true
          const pos = this._pointers.get(remainingId)!
          this._lastDragPos.copyFrom(pos)
        }
      }
    }
    if (pointerId === this._dragPointerId) {
      // If the pointer lifting is the one dragging, stop dragging
      this._dragging = false
      this._dragPointerId = null
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault()
    // Determine zoom direction. deltaY > 0 means wheel scrolled down (zoom out)
    const zoomIn = e.deltaY < 0
    const zoomFactor = 1 + 0.1 * this.wheelScrollSpeed // 10% zoom per notch (adjustable)
    let newScale = this.scale.x
    newScale = zoomIn ? newScale * zoomFactor : newScale / zoomFactor
    // Get mouse position relative to canvas (screen point)
    const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect()
    const screenPoint = new Point(e.clientX - rect.left, e.clientY - rect.top)
    this.zoomAroundPoint(screenPoint, newScale)
  }

  /** Helper to zoom the camera around a specific screen point (e.g., cursor or touch midpoint). */
  private zoomAroundPoint(screenPoint: Point, newScale: number): void {
    const oldScale = this.scale.x
    if (newScale === oldScale) return
    // Find the world coordinate under the screen point before scaling
    const worldPosBefore = this.toLocal(screenPoint)
    // Apply the new scale
    this.scale.set(newScale, newScale)
    // Find where that world position is now, after scaling
    const worldPosAfter = this.toLocal(screenPoint)
    // Adjust camera position by the difference, to keep the worldPosBefore under the screenPoint
    this.x += (worldPosBefore.x - worldPosAfter.x) * newScale
    this.y += (worldPosBefore.y - worldPosAfter.y) * newScale
    if (this.clamp) this.clampPosition()
  }

  /** Clamp the camera's position within the world bounds (prevents showing beyond edges). */
  private clampPosition(): void {
    if (this.worldWidth <= 0 || this.worldHeight <= 0) return
    const viewportWidth = this._viewportWidth
    const viewportHeight = this._viewportHeight
    const currentScale = this.scale.x
    // Calculate the camera bounds at current scale
    const maxX = 0
    const maxY = 0
    const minX = Math.min(0, viewportWidth - this.worldWidth * currentScale)
    const minY = Math.min(0, viewportHeight - this.worldHeight * currentScale)
    // Clamp position
    this.x = Math.min(maxX, Math.max(minX, this.x))
    this.y = Math.min(maxY, Math.max(minY, this.y))
  }

  private onKeyDown(e: KeyboardEvent): void {
    this._keys[e.key] = true
  }
  private onKeyUp(e: KeyboardEvent): void {
    this._keys[e.key] = false
  }

  /** Call this on each frame (e.g., in Pixi's ticker) to update camera based on arrow keys. */
  update(delta: number): void {
    if (!delta) delta = 1
    let moved = false
    const move = this.keySpeed * delta
    if (this._keys['ArrowLeft'] || this._keys['Left']) {
      this.x += move // move camera right (view pans left)
      moved = true
    }
    if (this._keys['ArrowRight'] || this._keys['Right']) {
      this.x -= move // move camera left (view pans right)
      moved = true
    }
    if (this._keys['ArrowUp'] || this._keys['Up']) {
      this.y += move // move camera down (view pans up)
      moved = true
    }
    if (this._keys['ArrowDown'] || this._keys['Down']) {
      this.y -= move // move camera up (view pans down)
      moved = true
    }
    if (moved && this.clamp) {
      this.clampPosition()
    }
  }
}
