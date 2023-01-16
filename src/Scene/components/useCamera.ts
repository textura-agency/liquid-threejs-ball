import * as THREE from 'three'
import { Scene } from 'three'

export const useCamera = (scene: Scene, width: number, height: number) => {
    const state = {
        near: .1,
        far: 30,
        fov: 45,
        aspect: width / height,
        position: [0, 0, 3]
    }
    const camera = new THREE.PerspectiveCamera(state.fov, state.aspect, state.near, state.far)
    camera.position.set(state.position[0], state.position[1], state.position[2])
    scene.add( camera )

    const resize = (width: number, height: number) => {
        state.aspect = width / height
        camera.aspect = state.aspect
        camera.updateProjectionMatrix()
    }

    return { instance: camera, resize }
}