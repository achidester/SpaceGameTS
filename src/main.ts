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

// Set up the canvas and renderer
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lock pointer on canvas click
canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

// Game state variables
let paused = false;
let gameInitialized = false; // Tracks if initialization is complete
const pauseOverlay = document.getElementById("pauseOverlay");
const loadingOverlay = document.getElementById("loadingOverlay");

// Ensure overlays start with the correct visibility
if (pauseOverlay) pauseOverlay.style.display = "none";
if (loadingOverlay) loadingOverlay.style.display = "flex";

// Arrays for projectiles
const projectiles: Projectile[] = [];

// Main game initialization function
async function initializeGame() {
  try {
    console.log("Starting game initialization...");

    // Set up the scene and player
    const { scene, player } = await setupScene();

    // Set up the camera
    const { camera } = setupCamera(player.mesh!.position);

    // Initialize UI
    const ui = new UI(player.maxHealth);

    // Create reticle and user controls
    const reticle = createReticle(camera, scene);
    setupUserControls();

    // Debugging tools (optional)
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    const gui = new GUI();
    const cameraFolder = gui.addFolder("CAMERA controls");
    cameraFolder.add(camera.position, "x", -10, 10);
    cameraFolder.add(camera.position, "y", -10, 10);
    cameraFolder.add(camera.position, "z", -10, 10);
    cameraFolder.open();

    // Initialize the enemy manager
    const enemyManager = new EnemyManager(scene, player, projectiles, 2000);

    // Hide the loading overlay once everything is ready
    if (loadingOverlay) loadingOverlay.style.display = "none";
    gameInitialized = true;

    console.log("Game initialization complete. Starting game loop...");

    // Handle shooting
    window.addEventListener('mousedown', (event) => {
      if (paused || !gameInitialized) return;
      if (event.button === 0) {
        const reticlePosition = reticle.getWorldPosition(new THREE.Vector3());
        const projectile = player.shoot(scene, reticlePosition);
        if (projectile) projectiles.push(projectile);
      }
    });

    // Pause handling
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Tab' && gameInitialized) {
        paused = !paused;
        if (pauseOverlay) {
          pauseOverlay.style.display = paused ? "flex" : "none";
        }
      }
    });

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Skip updates if the game is paused or not initialized
      if (!gameInitialized || paused) {
        if (paused) document.exitPointerLock();
        return;
      }

      // Stop game if player health is 0
      if (player.health <= 0) {
        document.exitPointerLock();
        return;
      }

      // Update projectiles
      projectiles.forEach((projectile, index) => {
        projectile.update();
        if (projectile.hasExceededRange()) {
          scene.remove(projectile.mesh);
          projectiles.splice(index, 1);
        }
      });

      // Update player and enemies
      updateObjectPosition(player, camera);
      player.mesh!.lookAt(reticle.getWorldPosition(new THREE.Vector3()));
      enemyManager.update();

      // Render the scene
      renderer.render(scene, camera);

      // Update debugging stats and UI
      stats.update();
      ui.drawHealthBar(player.health);
    }

    // Start the animation loop
    animate();
  } catch (error) {
    console.error("Failed to initialize game:", error);

    // Show error message on loading overlay
    if (loadingOverlay) {
      loadingOverlay.innerHTML = '<p style="color: red;">Failed to initialize the game. Please reload.</p>';
    }
  }
}

// Start the game
initializeGame();