import Canvas3d from "./extensions/canvas3d"
import { setToRender } from "textura-renderer"
import { useCamera } from "./components/useCamera"
import { useComposer } from "./components/useComposer"
import { useLiquedBall } from "./components/useLiquedBall"
import { useLight } from "./components/useLight"

export const useScene = (canvasParent: HTMLElement | null, canvas: HTMLCanvasElement | null) => {
    if (!canvasParent || !canvas) { return }
    const { scene, width, height, renderer, render, toRender, toResize } = new Canvas3d(canvasParent, canvas)
    const camera = useCamera(scene, width, height)
    const composer = useComposer(renderer, camera.instance, scene)
    useLight(scene)
    const ball = useLiquedBall(scene)

    toRender((time: number) => {
        composer.render()
        ball.render(time)
    })

    toResize((width: number, height: number) => {
        camera.resize(width, height)
    })

    setToRender({
        handler: (time: number) => render( time )
    })
}
