import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

import { setupScene } from './sceneSetup';
import { setupCamera, setupCameraControls, updateCameraPosition } from './cameraControls';
import { setupUserControls, updateObjectPosition } from './userControls';
import { Projectile } from './projectile';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

const { scene, player } = setupScene();
const { camera, spherical } = setupCamera(player.mesh.position);
setupCameraControls(spherical, camera, player.mesh.position, player.mesh); // Set up camera controls with spherical coordinates
setupUserControls();

const stats = new Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
const cubeFolder = gui.addFolder("CUBE position");
cubeFolder.add(player.mesh.position, "x", -5, 5);
cubeFolder.add(player.mesh.position, "y", 0, 5);
cubeFolder.add(player.mesh.position, "z", -5, 5);

const projectiles: Projectile[] = [];

window.addEventListener('mousedown', (event) => {
  if (event.button === 0) { // Left mouse button
    const projectile = player.shoot(scene);
    if (projectile) projectiles.push(projectile);
  }
});

function animate() {
  requestAnimationFrame(animate);

  // Update each projectile
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // Remove projectile if it goes out of bounds
    if (projectile.mesh.position.length() > 100) {
      scene.remove(projectile.mesh);
      projectiles.splice(index, 1);
    }
  });

  // Update player and camera as before
  updateObjectPosition(player.mesh, camera);
  updateCameraPosition(camera, spherical, player.mesh.position);

  renderer.render(scene, camera);
  stats.update();
}

animate();