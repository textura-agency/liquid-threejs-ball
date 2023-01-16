import * as THREE from 'three'
import { Camera, Scene, WebGLRenderer } from "three"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

export const useComposer = (renderer: WebGLRenderer, camera: Camera, scene: Scene) => {
    const renderScene = new RenderPass(scene, camera)

    const bloomComposer = new EffectComposer(renderer)
    bloomComposer.addPass(renderScene)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      .1,
      .1,
      0
    )
    bloomComposer.addPass(bloomPass)
    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader)
    bloomComposer.addPass(gammaCorrectionPass)

    const resize = (width: number, height: number) => {
        bloomComposer.setSize(width, height)
    }

    const render = () => {
        bloomComposer.render()
    }

    return { resize, render }
}