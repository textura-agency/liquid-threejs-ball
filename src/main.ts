import './style.css'
import { useScene } from './Scene'
import { startRender, subscribeMouse } from 'textura-renderer'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `<canvas />`


startRender()
subscribeMouse()
useScene(document.querySelector<HTMLCanvasElement>('#app'), document.querySelector<HTMLCanvasElement>('canvas'))
