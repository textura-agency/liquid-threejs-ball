import * as THREE from 'three'
import { getElementDocumentCoords } from 'textura-renderer'

interface ICanvas3d {
  render(time: number): void
  unmount(): void
}

class Canvas3d {
  protected parent: HTMLElement
  public canvas: HTMLCanvasElement
  public scene: any
  public renderer: any

  public width: number = 0
  public height: number = 0
  public ratio: number = 0
  private rendering: Array<any> = []
  private resizing: Array<any> = []
  private onUnmount: Array<any> = []
  private isRenderActive = false

  protected checkWindow = false

  constructor(parent: HTMLElement, canvas: HTMLCanvasElement) {
    this.parent = parent
    this.canvas = canvas

    if (!this.parent || !this.canvas) {
      console.warn(`canvas3d: No needed dom found`)
      this.stopRender()
      return
    }

    this.scene = new THREE.Scene()
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.outputEncoding = THREE.sRGBEncoding

    this.resize = this.resize.bind(this)
    this.render = this.render.bind(this)
    this.toResize = this.toResize.bind(this)
    this.toRender = this.toRender.bind(this)
    this.toUnmount = this.toUnmount.bind(this)
    this.unmount = this.unmount.bind(this)
    window.addEventListener('resize', this.resize)
    this.startRender()
    this.resize()
  }

  public toResize(cb: any): void {
    this.resizing.push(cb)
  }

  protected stopRender(): void {
    this.isRenderActive = false
  }

  protected startRender(): void {
    this.isRenderActive = true
  }

  public toRender(cb: any): void {
    this.rendering.push(cb)
  }

  public toUnmount(cb: any): void {
    this.onUnmount.push(cb)
  }

  private resize(): void {
    const parentCoords: any = this.checkWindow
      ? { width: window.innerWidth, height: window.innerHeight }
      : getElementDocumentCoords(this.parent)
    const needResize: boolean =
      this.width !== parentCoords.width || this.height !== parentCoords.height
    if (needResize) {
      this.width = parentCoords.width
      this.height = parentCoords.height
      this.ratio = window.devicePixelRatio
      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(this.ratio)
      this.resizing.forEach((cb) => cb(this.width, this.height))
    }
  }

  public render(time: number): void {
    if (!this.isRenderActive) {
      return
    }
    this.rendering.forEach((cb) => cb(time, this.width, this.height))
  }

  public unmount(): void {
    window.removeEventListener('resize', this.resize)
    this.onUnmount.forEach((cb) => cb())
  }
}

export default Canvas3d
export type { ICanvas3d }
