import * as THREE from 'three'
import { Shader } from 'three'
import { perlin4d } from './perlin4d'

export const liquedPhysycalMaterial = () => {
    const material = new THREE.MeshPhysicalMaterial({ 
        color: 0xd39bff,
        roughness: .4,
        metalness: 0,
    })
    const materialShader = { value: null as Shader | null }
    material.onBeforeCompile = shader => {
        shader.uniforms.iTime = { value: 0 }
        shader.uniforms.iMouse = { value: { x: 0, y: 0 } }

        // vertex shader
        shader.vertexShader = `
            uniform float iTime;
            uniform vec2 iMouse;
            varying float vPerlingStrength;
            varying vec3 vUv2;

            float INTERSECTION_RADIUS = .2;

            ${perlin4d}
            \n
        `
        + shader.vertexShader.replace('void main() {', `
            void main() {
                vec3 newPosition = position;

                float uDisplacementFrequency = 2.;
                float uDisplacementStrength = .2;

                float t = iTime + (iMouse.x + iMouse.y);
                float perlingStrength = perlin4d(vec4(position * uDisplacementFrequency, t)) * uDisplacementStrength;
                newPosition += normal * perlingStrength;

                // if ( abs(newPosition.x - iMouse.x) <= INTERSECTION_RADIUS ) {
                //     if (abs(newPosition.y - iMouse.y) <= INTERSECTION_RADIUS) {
                //         newPosition.x += iMouse.x - newPosition.x;
                //         newPosition.y += iMouse.y - newPosition.y;
                //         newPosition.z = pow(newPosition.x, 2.) + pow(newPosition.y, 2.);
                //     }
                // }

                vUv2 = newPosition;\n
        `).replace(`#endif\n}`, `
            #endif
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
            vNormal = normal;
            vPerlingStrength = perlingStrength;
        }`)
        // 

        // fragment shader 
        shader.fragmentShader = `
            varying float vPerlingStrength;
            varying vec3 vUv2;

            vec4 firstColor = vec4(.5, 0., .9, 1.0);
            vec4 middleColor = vec4(.5, 0., .5, .5);
            vec4 endColor = vec4(.5, 1., .9, .5);
            vec4 blueColor = vec4(0, 0, 1., 1.0);
        `
        + shader.fragmentShader.replace('void main() {', `
            void main() {
                float h = .3;
                vec3 p = vUv2 + .5;
                vec4 col = mix(
                    mix(firstColor, middleColor, (p.y)/h), 
                    mix(middleColor, endColor, ((p.x*p.z) - h)/(1.0 - h)), 
                    p.x*p.y
                );
                vec4 col2 = mix(
                    mix(endColor, col, (p.x*p.z)/h),
                    mix(col, blueColor, ((p.x*p.z) - h)/(1.0 - h)),
                    p.x*p.y
                );
                vec4 col3 = mix(
                    mix(col2, firstColor, (p.x)/h),
                    mix(firstColor, col2, ((p.x) - h)/(1.0 - h)),
                    p.x
                );
        `).replace('#include <output_fragment>', `
            gl_FragColor = vec4(  (vec3(1., 1., 1.) * vPerlingStrength + .1 / 2.), diffuseColor.a );
        `)
        // 

        materialShader.value = shader
    }
    const render = (iTime: number, mouse: { x: number, y: number }) => {
        if (materialShader.value) {
            materialShader.value.uniforms[ 'iTime' ].value = iTime
            materialShader.value.uniforms[ 'iMouse' ].value = mouse
        }
    }

    return { instance: material, render }
}