import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { GUI } from 'dat.gui'

// SCENE

const sceneA = new THREE.Scene()
sceneA.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
const sceneB = new THREE.Scene()
sceneB.background = new THREE.Color(0x123456)
const sceneC = new THREE.Scene()
sceneC.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])

sceneA.add(new THREE.GridHelper())
let activeScene = sceneA
const setScene = {
  sceneA: () => { activeScene = sceneA },
  sceneB: () => { activeScene = sceneB },
  sceneC: () => { activeScene = sceneC }
}

// CAMERA

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 3)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})


new OrbitControls(camera, renderer.domElement)
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true, flatShading: true})

const cube = new THREE.Mesh(geometry, material)
cube.position.y = .5
activeScene.add(cube)

const stats = new Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder("CUBE")
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2)
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2)
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2)
cubeFolder.open()

const cameraFolder = gui.addFolder("CAMERA")
cameraFolder.add(camera.position, "x", -20, 20)
cameraFolder.add(camera.position, "y", 0, 50)
cameraFolder.add(camera.position, "z", 0, 20)

const sceneFolder = gui.addFolder("SCENE")
sceneFolder.add(setScene, 'sceneA').name('Scene A')
sceneFolder.add(setScene, 'sceneB').name('Scene B')
sceneFolder.add(setScene, 'sceneC').name('Scene C')
sceneFolder.open()




function animate() {

  // set framerate
  setTimeout( function() {

    requestAnimationFrame( animate );

  }, 1000 / 50 );

  
  camera.lookAt(0, 0.5, 0)
  
  
  // cube.rotation.x += 0.001
  // cube.rotation.y += 0.001 

  renderer.render(activeScene, camera)
  stats.update()
}

animate()