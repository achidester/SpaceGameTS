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


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false; // Disable panning when locked on target
controls.enableZoom = true; // Allow zooming if desired


const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial({ wireframe: true })

// OBJECTS
const cube = new THREE.Mesh(geometry, material)
cube.position.y = .5
sceneA.add(cube)

// PIVOT POINT FOR CAMERA ORBIT
const pivot = new THREE.Object3D();
pivot.position.copy(cube.position); // Set pivot at the cube's position
sceneA.add(pivot);

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

// Key movement setup
const movementSpeed = 0.1;
const keyState = {
  w: false,
  a: false,
  s: false,
  d: false,
};

function handleKeyDown(event) {
  if (keyState.hasOwnProperty(event.key)) keyState[event.key] = true;
}

function handleKeyUp(event) {
  if (keyState.hasOwnProperty(event.key)) keyState[event.key] = false;
}

function updateCubePosition() {
  if (keyState.w) cube.position.z -= movementSpeed; // Move forward
  if (keyState.s) cube.position.z += movementSpeed; // Move backward
  if (keyState.a) cube.position.x -= movementSpeed; // Move left
  if (keyState.d) cube.position.x += movementSpeed; // Move right
}

// Add event listeners for key controls
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

// Lock-on target control with camera pivot 
const guiControls = {
  lockOnTarget: false,
};
cameraFolder.add(guiControls, 'lockOnTarget').name('Lock on Target').onChange((value) => {
  if (value) {
    controls.target.copy(cube.position); // Lock controls target to cube
    controls.enablePan = false; // Disable panning when locked on target
  } else {
    controls.target.set(0, 0, 0); // Reset controls target to default
    controls.enablePan = true; // Re-enable panning if desired
  }
  controls.update(); // Update controls to reflect changes
});

const clock = new THREE.Clock();
// ANIMATION
function animate() {
  const delta = clock.getDelta();
  requestAnimationFrame(animate);

  if (guiControls.lockOnTarget) {
    // Continuously update the target to follow the cube's position
    controls.target.copy(cube.position);
  }

  updateCubePosition(); // Update cube position based on key inputs
  controls.update(); // Update OrbitControls every frame
  renderer.render(sceneA, camera);
  stats.update();
}

animate()

