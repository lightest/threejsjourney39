import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import firefliesVS from "./shaders/fireflies/vertex.glsl";
import firefliesFS from "./shaders/fireflies/fragment.glsl";
import portalVS from "./shaders/portal/vertex.glsl";
import portalFS from "./shaders/portal/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
    width: 400
})

const debugObject = {
    envMapIntensity: 4.321,
    ambientLight: 1,
    portalColor: 0x95a4d0,
    portalColorMul: 2.039
};

gui.add(debugObject, "envMapIntensity", 1, 10, .001).onChange(() =>
{
    bakedMaterial.envMapIntensity = debugObject.envMapIntensity;
});

gui.add(debugObject, "ambientLight", 1, 100, .001).onChange(() =>
{
    ambientLight.intensity = debugObject.ambientLight;
});

gui.add(debugObject, "portalColorMul", 1, 100, .001).onChange((v) =>
{
    portalMaterial.uniforms.uPortalColorMul.value = v;
});

gui.addColor(debugObject, "portalColor").onChange(() =>
{
    portalMaterial.uniforms.uPortalColor.value.set(debugObject.portalColor);
});

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

// Textures
// Baked texs.
const bakedTex = textureLoader.load("scene_baked_rendered2.jpg", () =>
{
});

bakedTex.flipY = false;
bakedTex.colorSpace = THREE.SRGBColorSpace;

// Render target.
const cubeRT = new THREE.WebGLCubeRenderTarget(256, {
    type: THREE.HalfFloatType
});
// scene.background = cubeRT.texture;
scene.environment = cubeRT.texture;
const cubeCamera = new THREE.CubeCamera(.1, 100, cubeRT);
cubeCamera.position.set(0, .95, -1);
// cubeCamera.layers.set(1);

/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshStandardMaterial({ roughness: .3, metalness: 1, color: 0xaaaaaa, envMapIntensity: 1 })
// )
// cube.position.set(0, 3, 0)
// scene.add(cube)


// Materials
// Baked material
let bakedMaterial = new THREE.MeshStandardMaterial(
    {
        map: bakedTex,
        envMapIntensity: 1,
        roughness: .3, metalness: 1, color: 0xaaaaaa,
        // envMap: cubeRT.texture
    }
);

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({
    color: 0xfffff4
});

const portalMaterial = new THREE.ShaderMaterial({
    vertexShader: portalVS,
    fragmentShader: portalFS,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: {
            value: 0
        },

        uPortalColor: {
            value: new THREE.Color(debugObject.portalColor)
        },

        uPortalColorMul: {
            value: debugObject.portalColorMul
        },

        uEdgeStart: {
            value: 0.383
        },

        uEdgeEnd: {
            value: 0.755
        },

        uEdgeMul: {
            value: 10.
        },

        uCosFreqAdd: {
            value: 1.
        },

        uCosAmpMul: {
            value: 1.563
        },
    }
});

gui.add(portalMaterial.uniforms.uEdgeStart, "value", .0, 3., .001).name("uEdgeStart");
gui.add(portalMaterial.uniforms.uEdgeEnd, "value", .0, 3., .001).name("uEdgeEnd");
gui.add(portalMaterial.uniforms.uEdgeMul, "value", 1., 10., .001).name("uEdgeMul");
gui.add(portalMaterial.uniforms.uCosFreqAdd, "value", 1., 5., .001).name("uCosFreqAdd");
gui.add(portalMaterial.uniforms.uCosAmpMul, "value", 1., 5., .001).name("uCosAmpMul");

// Model
gltfLoader.load("scene2_merged.glb", (glb) =>
{

    const bakedMesh = glb.scene.children.find(child => child.name === "baked");
    const polelight0 = glb.scene.children.find((child) =>
    {
        return child.name === "polelight0";
    });

    const polelight1 = glb.scene.children.find((child) =>
    {
        return child.name === "polelight1";
    });

    const gateportal = glb.scene.children.find((child) =>
    {
        return child.name === "gateportal";
    });

    const gatelight0 = glb.scene.children.find((child) =>
    {
        return child.name === "gatelight0";
    });

    const gatelight1 = glb.scene.children.find((child) =>
    {
        return child.name === "gatelight1";
    });

    const gatelight2 = glb.scene.children.find((child) =>
    {
        return child.name === "gatelight2";
    });

    const gatelight3 = glb.scene.children.find((child) =>
    {
        return child.name === "gatelight3";
    });

    const gatelight4 = glb.scene.children.find((child) =>
    {
        return child.name === "gatelight4";
    });

    const gatelight5 = glb.scene.children.find((child) =>
    {
        return child.name === "gatelight5";
    });

    // bakedMesh.material = bakedMaterial;
    bakedMesh.material.map = bakedTex;
    bakedMesh.material.envMapIntensity = debugObject.envMapIntensity;
    bakedMaterial = bakedMesh.material;
    polelight0.material = poleLightMaterial;
    polelight1.material = poleLightMaterial;
    gatelight0.material = poleLightMaterial;
    gatelight1.material = poleLightMaterial;
    gatelight2.material = poleLightMaterial;
    gatelight3.material = poleLightMaterial;
    gatelight4.material = poleLightMaterial;
    gatelight5.material = poleLightMaterial;
    gateportal.material = portalMaterial;
    // glb.scene.layers.enable(1);

    scene.add(glb.scene);
})

// Firefly
const fireflyGeometry = new THREE.BufferGeometry();
const fireflyCount = 32;
const positions = new Float32Array(fireflyCount * 3);
const scales = new Float32Array(fireflyCount);
for (let i = 0; i < fireflyCount; i++)
{
    positions[ i * 3 ] = (Math.random() - .5) * 4;
    positions[ i * 3 + 1 ] = Math.random() * 3;
    positions[ i * 3 + 2 ] = (Math.random() - .5) * 4;
    scales[ i ] = Math.random();
}

fireflyGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
fireflyGeometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

const fireflyMaterial = new THREE.ShaderMaterial({
    vertexShader: firefliesVS,
    fragmentShader: firefliesFS,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
        uTime: {value: 0},
        uPixelRatio: {
            value: Math.min(window.devicePixelRatio, 2)
        },
        uFireflySize: {
            value: 143.
        }
    }
});
gui.add(fireflyMaterial.uniforms.uFireflySize, "value", 1., 500., 1.).name("firefly_size");

const fireflyPoints = new THREE.Points(fireflyGeometry, fireflyMaterial);
// fireflyPoints.layers.set(1);
scene.add(fireflyPoints);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, debugObject.ambientLight);
// ambientLight.layers.enable(1);
scene.add(ambientLight);
console.log(ambientLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    fireflyMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
camera.layers.enable(1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

debugObject.clearColor = 0x000d1f;
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() =>
{
    renderer.setClearColor(debugObject.clearColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    fireflyMaterial.uniforms.uTime.value = elapsedTime;
    portalMaterial.uniforms.uTime.value = elapsedTime;

    cubeCamera.update(renderer, scene);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
