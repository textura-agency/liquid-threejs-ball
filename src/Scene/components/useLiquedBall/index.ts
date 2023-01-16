import * as THREE from 'three'
import { Scene } from 'three'
import { liquedPhysycalMaterial } from './liquedMaterial'
import { useMouse } from '../useMouse'

export const useLiquedBall = ( scene: Scene ) => {
    const state = {
        position: [0, 0, 0]
    }

    const material = liquedPhysycalMaterial()
    const geometry = new THREE.SphereGeometry(.5, 128, 128)
    const mesh = new THREE.Mesh(geometry, material.instance)
    mesh.receiveShadow = true
    mesh.castShadow = true
    mesh.position.set(state.position[0], state.position[1], state.position[2])
    scene.add(mesh)

    const mouse = useMouse()

    const render = ( time: number ) => {
        material.render(time / 1000, mouse.scene)
        mesh.rotation.set(mouse.scene.y, mouse.scene.x, 0)
        mouse.render()
    }

    const resize = () => {

    }

    return { instance: mesh, render, resize }
}