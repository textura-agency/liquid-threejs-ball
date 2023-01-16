import * as THREE from 'three'
import { Scene } from 'three'

export const useLight = (scene: Scene) => {
    const ambLight = new THREE.AmbientLight(0xFFFFFF, .1)
    const dirLight = new THREE.DirectionalLight(0xFFFFFF, .8)
    const dirLight2 = new THREE.DirectionalLight(0xFEFEFE, .8)

    dirLight.position.set(0, 50, 50)
    dirLight2.position.set(0, -50, -50)

    scene.add(ambLight)
    scene.add(dirLight)
    scene.add(dirLight2)
    

    return {}
}