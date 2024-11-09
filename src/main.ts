import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

// SCENE
const sceneA = new THREE.Scene()
sceneA.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
sceneA.add(new THREE.GridHelper())

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// set camera at positon:
camera.position.set(0, 2, 3)


// RENDERER
const canvas = document.getElementById('canvas') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// })

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => {
  renderer.render(sceneA, camera)
})
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

// OBJECTS
const cube = new THREE.Mesh(geometry, material)
cube.position.y = .5
sceneA.add(cube)

// GUI STATS (FPS)
const stats = new Stats()
document.body.appendChild(stats.dom)

// GUI CONTROLS
const gui = new GUI()
// GUI - CUBE
const cubeRotationFolder = gui.addFolder("CUBE rotation")
cubeRotationFolder.add(cube.rotation, "x", 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, "y", 0, Math.PI * 2)
cubeRotationFolder.add(cube.rotation, "z", 0, Math.PI * 2)
// GUI - CUBE
const cubeFolder = gui.addFolder("CUBE position")
cubeFolder.add(cube.position, "x", -5, 5)
cubeFolder.add(cube.position, "y", -5, 5)
cubeFolder.add(cube.position, "z", -5, 5)
// GUI - CAMERA
const cameraFolder = gui.addFolder("CAMERA")
cameraFolder.add(camera.position, "x", -20, 20)
cameraFolder.add(camera.position, "y", 0, 50)
cameraFolder.add(camera.position, "z", 0, 20)


const clock = new THREE.Clock()
let delta

// ANIMATION
function animate() {
  // set framerate
  // setTimeout(function () {
  // place animations in here for fps changes
  // }, 1000 / 100);

  delta = clock.getDelta()
  // cube.rotation.y += .4 * delta
  requestAnimationFrame(animate);

  camera.lookAt(0, 0.5, 0)


  renderer.render(sceneA, camera)
  stats.update()
}

animate()

