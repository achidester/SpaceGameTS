import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

import { setupScene } from './sceneSetup';
import { setupCamera, setupCameraControls, updateCameraPosition } from './cameraControls';
import { setupUserControls, updateObjectPosition } from './userControls';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

const { scene, cube } = setupScene();
const { camera, radius, spherical } = setupCamera(cube.position);
setupCameraControls(spherical, camera, cube.position); // Set up camera controls with spherical coordinates
setupUserControls();

const stats = new Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
const cubeFolder = gui.addFolder("CUBE position");
cubeFolder.add(cube.position, "x", -5, 5);
cubeFolder.add(cube.position, "y", 0, 5);
cubeFolder.add(cube.position, "z", -5, 5);

function animate() {
  requestAnimationFrame(animate);

  // Move cube based on camera orientation and user input
  updateObjectPosition(cube, camera);

  // Update camera position to follow the cube, keeping the azimuthal orbit
  updateCameraPosition(camera, spherical, cube.position);

  renderer.render(scene, camera);
  stats.update();
}

animate();