import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

import { setupScene } from './sceneSetup';
import { setupCamera, updateCameraPosition } from './cameraControls';
import { setupUserControls, updateCubePosition } from './userControls';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Capture cursor
canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

// Initialize Scene
const { scene, cube } = setupScene();
const camera = setupCamera();

// Stats and GUI
const stats = new Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
const cubeFolder = gui.addFolder("CUBE position");
cubeFolder.add(cube.position, "x", -5, 5);
cubeFolder.add(cube.position, "y", 0, 5);
cubeFolder.add(cube.position, "z", -5, 5);

setupUserControls();

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  updateCubePosition(cube);
  updateCameraPosition(camera, cube);

  renderer.render(scene, camera);
  stats.update();
}

animate();