import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';

import { setupScene } from './sceneSetup';
import { setupCamera } from './cameraControls';
import { setupUserControls, updateObjectPosition } from './userControls';
import { Projectile } from './projectile';
import { spawnEnemy, moveEnemy } from './enemy';

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
// setupCameraControls(camera, player.mesh.position, player.mesh); // Set up camera controls
setupUserControls();

// Set up stats and GUI for debugging
const stats = new Stats();
document.body.appendChild(stats.dom);
const gui = new GUI();
const cubeFolder = gui.addFolder("CUBE position");
cubeFolder.add(player.mesh.position, "x", -5, 5);
cubeFolder.add(player.mesh.position, "y", 0, 5);
cubeFolder.add(player.mesh.position, "z", -5, 5);

// Set up reticle target
function createReticle() {
  const reticleGeometry = new THREE.SphereGeometry(3, 10, 10); // Adjust size as needed
  const reticleMaterial = new THREE.MeshBasicMaterial({ color: 0xd6d63e, transparent: true, opacity: .5 });
  const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);

  // Start with the reticle positioned in front of the camera at a distance
  reticle.position.set(0, 0, -10);

  return reticle;
}

const reticle = createReticle();
scene.add(reticle); // Add the reticle independently to the scene

// Mousemove event listener to move the reticle based on mouse position
let isPointerLocked = false;
let accumulatedMouseX = 0;
let accumulatedMouseY = 0;

// Detect pointer lock status
document.addEventListener('pointerlockchange', () => {
  isPointerLocked = !!document.pointerLockElement;
});

window.addEventListener('mousemove', (event) => {
  if (isPointerLocked) {
    // Use relative movement values when pointer is locked
    accumulatedMouseX += event.movementX * 0.002; // Adjust sensitivity as needed
    accumulatedMouseY -= event.movementY * 0.002;

    // Clamp values to keep reticle within bounds (e.g., [-1, 1])
    accumulatedMouseX = Math.max(-1, Math.min(1, accumulatedMouseX));
    accumulatedMouseY = Math.max(-1, Math.min(1, accumulatedMouseY));
  } else {
    // Use absolute position values when pointer is not locked
    accumulatedMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    accumulatedMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Set a fixed distance from the camera for the reticle
  const reticleDistance = 60;
  
  // Create a 3D position based on normalized coordinates and unproject
  const reticlePosition = new THREE.Vector3(accumulatedMouseX, accumulatedMouseY, -1).unproject(camera);
  
  // Calculate direction and position the reticle
  const direction = reticlePosition.sub(camera.position).normalize();
  reticle.position.copy(camera.position).add(direction.multiplyScalar(reticleDistance));
});

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

function animate() {
  requestAnimationFrame(animate);

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