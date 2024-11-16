import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

import { UI } from './ui'; 
import { setupScene } from './sceneSetup';
import { setupCamera } from './camera';
import { Projectile } from './projectile';
import { createReticle } from './reticle';
import { setupUserControls, updateObjectPosition } from './userControls';
import { EnemyManager } from './enemyManager';


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

// Set up the scene and player
const { scene, player } = setupScene();
// Set up the camera and controls
const { camera } = setupCamera(player.mesh.position);
const ui = new UI(player.maxHealth);
const reticle = createReticle(camera, scene);
setupUserControls();

// Set up stats and GUI for debugging (DEV)
const stats = new Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
const cubeFolder = gui.addFolder("CUBE position");
cubeFolder.add(player.mesh.position, "x", -5, 5);
cubeFolder.add(player.mesh.position, "y", 0, 5);
cubeFolder.add(player.mesh.position, "z", -5, 5);
const cameraFolder = gui.addFolder("CAMERA controls");
cameraFolder.add(camera.position, "x", -10, 10);
cameraFolder.add(camera.position, "y", -10, 10);
cameraFolder.add(camera.position, "z", -10, 10);
cameraFolder.open()



// Initialize projectiles and enemies
const projectiles: Projectile[] = [];
const enemyManager = new EnemyManager(scene, player, projectiles,  2000);

// Handle shooting
window.addEventListener('mousedown', (event) => {
  if (paused) return; 
  if (event.button === 0) { // Left mouse button
    const reticlePosition = reticle.getWorldPosition(new THREE.Vector3());
    const projectile = player.shoot(scene, reticlePosition);
    if (projectile) projectiles.push(projectile);
  }
}); 


let paused = false;

const pauseOverlay = document.getElementById("pauseOverlay");
if (pauseOverlay) {
  pauseOverlay.style.display = "none";
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    paused = !paused;
    if (pauseOverlay) {
      if (paused) {
        // Temporarily hide and re-show to force repaint
        pauseOverlay.style.display = "none";
        setTimeout(() => pauseOverlay.style.display = "flex", 0);
      } else {
        pauseOverlay.style.display = "none";
      }
    }
  }
});

function animate() {
  requestAnimationFrame(animate);

  // Game is paused, skip the rest of the updates
  if (paused) {
    document.exitPointerLock();
    return;
  }
  // Player dead, stop game
  if (player.health <= 0) {
    document.exitPointerLock();
    return;
  }
  
  // Update each projectile and check if it has exceeded its range
  projectiles.forEach((projectile, index) => {
    projectile.update();

    // Remove projectile if it exceeds max range
    if (projectile.hasExceededRange()) {
      scene.remove(projectile.mesh);
      projectiles.splice(index, 1);
    }
  });

  // Update player position based on input
  updateObjectPosition(player, camera);

  // Make the player cube face the reticle
  player.mesh.lookAt(reticle.getWorldPosition(new THREE.Vector3()));
  enemyManager.update();
  renderer.render(scene, camera);
  stats.update();
  ui.drawHealthBar(player.health);
}



animate();