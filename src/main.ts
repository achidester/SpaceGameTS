import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

import { setupScene } from './sceneSetup';
import { setupCamera } from './cameraControls';
import { setupUserControls, updateObjectPosition } from './userControls';
import { Projectile } from './projectile';
import { spawnEnemy, moveEnemy } from './enemy';
import { createReticle } from './reticle';

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
const reticle = createReticle(camera, scene);
setupUserControls();

// Set up stats and GUI for debugging
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
const enemies: THREE.Mesh[] = [];
let enemySpawnTimer = 0;
const spawnInterval = 2000;

// Handle shooting
window.addEventListener('mousedown', (event) => {
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

  if (paused) {
    // Game is paused, skip the rest of the updates
    return;
  }

  // Spawn enemies at intervals
  if (Date.now() - enemySpawnTimer > spawnInterval) {
    const enemy = spawnEnemy();
    enemies.push(enemy);
    enemySpawnTimer = Date.now();
  }

  // Move each enemy toward the player and check for collisions
  enemies.forEach((enemy, enemyIndex) => {
    moveEnemy(enemy);

    // Check for collisions with projectiles
    projectiles.forEach((projectile, projectileIndex) => {
      const distance = enemy.position.distanceTo(projectile.mesh.position);
      if (distance < 1) { // Adjust collision distance as needed
        // Remove enemy and projectile on collision
        scene.remove(enemy);
        enemies.splice(enemyIndex, 1);

        scene.remove(projectile.mesh);
        projectiles.splice(projectileIndex, 1);
      }
    });

    // Optional: Remove the enemy if it gets too close to the player
    const distanceToPlayer = enemy.position.distanceTo(player.position);
    if (distanceToPlayer < 1) {
      // Handle collision or player damage here if needed
      scene.remove(enemy);
      enemies.splice(enemyIndex, 1);
    }
  });

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
  updateObjectPosition(player.mesh, camera);

  // Make the player cube face the reticle
  player.mesh.lookAt(reticle.getWorldPosition(new THREE.Vector3()));

  renderer.render(scene, camera);
  stats.update();
}
animate();