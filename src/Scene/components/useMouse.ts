import { getMouseCoords, lerp } from "textura-renderer"

export const useMouse = () => {
    const mouse = { x: window.innerWidth/2, y: window.innerHeight/2 }
    const scene = { x: 0, y: 0 }

    const render = () => {
        const { x, y } = getMouseCoords().window
        if (!x || !y) { return }
        mouse.x = lerp(mouse.x, x, .1)
        mouse.y = lerp(mouse.y, y, .1)

        scene.x = ((mouse.x - window.innerWidth) / window.innerWidth + .5) * 2
        scene.y = ((mouse.y - window.innerHeight) / window.innerHeight + .5) * -2
    }

    return { screen: mouse, scene, render }
}