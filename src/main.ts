import './style.css';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

// SCENE
const sceneA = new THREE.Scene();
sceneA.background = new THREE.CubeTextureLoader().setPath('https://sbcode.net/img/').load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
sceneA.add(new THREE.GridHelper());

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 4); // Initial position

// RENDERERds
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// OBJECTS
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshNormalMaterial({ wireframe: true });
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
sceneA.add(cube);

// STATS (FPS)
const stats = new Stats();
document.body.appendChild(stats.dom);

// GUI CONTROLS
const gui = new GUI();
const cubeRotationFolder = gui.addFolder("CUBE rotation");
cubeRotationFolder.add(cube.rotation, "x", 0, Math.PI * 2);
cubeRotationFolder.add(cube.rotation, "y", 0, Math.PI * 2);
cubeRotationFolder.add(cube.rotation, "z", 0, Math.PI * 2);

const cubeFolder = gui.addFolder("CUBE position");
cubeFolder.add(cube.position, "x", -5, 5);
cubeFolder.add(cube.position, "y", -5, 5);
cubeFolder.add(cube.position, "z", -5, 5);

const cameraFolder = gui.addFolder("CAMERA");
cameraFolder.add(camera.position, "x", -20, 20);
cameraFolder.add(camera.position, "y", 0, 50);
cameraFolder.add(camera.position, "z", 0, 20);

// Key movement setup
const movementSpeed = 0.1;
const keyState: Record<string, boolean> = {
  w: false,
  a: false,
  s: false,
  d: false,
};

function handleKeyDown(event: KeyboardEvent): void {
  if (keyState.hasOwnProperty(event.key)) keyState[event.key as keyof typeof keyState] = true;
}

function handleKeyUp(event: KeyboardEvent): void {
  if (keyState.hasOwnProperty(event.key)) keyState[event.key as keyof typeof keyState] = false;
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

function updateCubePosition() {
  if (keyState.w) cube.position.z -= movementSpeed;
  if (keyState.s) cube.position.z += movementSpeed;
  if (keyState.a) cube.position.x -= movementSpeed;
  if (keyState.d) cube.position.x += movementSpeed;
}

// Track mouse movement for camera rotation
let prevMouseX = 0;
let prevMouseY = 0;
let isMouseInitialized = false;
const rotationSpeed = 0.005;

// Initialize spherical coordinates once based on the camera's initial position
const spherical = new THREE.Spherical();
spherical.setFromVector3(camera.position.clone().sub(cube.position));

window.addEventListener('mousemove', (event) => {
  // Initialize previous mouse position on the first move
  if (!isMouseInitialized) {
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
    isMouseInitialized = true;
    return;
  }

  // Calculate the delta values
  const deltaX = event.clientX - prevMouseX;
  const deltaY = event.clientY - prevMouseY;

  // Update the previous mouse position immediately
  prevMouseX = event.clientX;
  prevMouseY = event.clientY;

  // Smoothly adjust theta and phi based on delta values
  spherical.theta -= deltaX * rotationSpeed;
  spherical.phi -= deltaY * rotationSpeed;

  // Clamp phi to avoid the camera flipping over the target
  spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

  // Set the new camera position based on spherical coordinates
  camera.position.copy(cube.position).add(new THREE.Vector3().setFromSpherical(spherical));
  camera.lookAt(cube.position);
});

const clock = new THREE.Clock();

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  updateCubePosition(); // Update cube position based on key inputs
  camera.position.copy(cube.position).add(new THREE.Vector3().setFromSpherical(spherical));
  camera.lookAt(cube.position);
  renderer.render(sceneA, camera);
  stats.update();
}

animate();