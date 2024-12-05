import * as THREE from 'three';
import { setupScene } from './sceneSetup';
import { setupCamera } from './camera';
import { Projectile } from './projectile';
import { createReticle } from './reticle';
import { setupUserControls, updateObjectPosition } from './userControls';
import { EnemyManager } from './enemyManager';
import { OverlayManager } from './overlay';
import { initializeUI } from './initializeUI';
import { setupStats } from './setupStats';
import { setupDevGUI } from './setupDevGUI';
import { Player } from './player';
import { UI } from './ui';

// Set up the canvas and renderer
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const overlayManager = new OverlayManager();


// Lock pointer on canvas click
canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

// Game state variables
let gameInitialized = false; // Tracks if initialization is complete

// Arrays for projectiles
const projectiles: Projectile[] = [];

function initializeEnemyManager(
  scene: THREE.Scene,
  player: Player,
  projectiles: Projectile[],
  spawnInterval: number = 2000 // Default spawn interval
): EnemyManager {
  return new EnemyManager(scene, player, projectiles, spawnInterval);
}

function setupEventListeners(
  player: Player,
  scene: THREE.Scene,
  reticle: THREE.Object3D,
) {
  // Handle shooting
  window.addEventListener("mousedown", (event) => {
    if (overlayManager.isPaused() || !overlayManager.isGameInitialized()) return;
    if (event.button === 0) {
      const reticlePosition = reticle.getWorldPosition(new THREE.Vector3());
      const projectile = player.shoot(scene, reticlePosition);
      if (projectile) projectiles.push(projectile);
    }
  });
  // Pause handling
  window.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && overlayManager.isGameInitialized()) {
      overlayManager.togglePause();
    }
  });
}



// Main game initialization function
async function initializeGame() {

  try {
    console.log("Starting game initialization...");

    const { scene, player } = await setupScene();
    const { camera } = setupCamera(player.mesh!.position);
    const ui = initializeUI(player.maxHealth);
    const stats = setupStats();
    setupDevGUI(camera);

    // Create reticle and user controls
    const reticle = createReticle(camera, scene);
    setupUserControls();
    const enemyManager = initializeEnemyManager(scene, player, projectiles);
    setupEventListeners(player, scene, reticle);

    
    gameInitialized = true;
    overlayManager.setGameInitialized(gameInitialized);
    console.log("Game initialization complete. Starting game loop...");

    


    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      // Skip updates if the game is paused or not initialized
      if (!gameInitialized || overlayManager.isPaused()) {
        if (overlayManager.isPaused()) document.exitPointerLock(); // give cursor pointer back when paused
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
    overlayManager.showError("Failed to initialize the game. Please reload.");
  }
}

// Start the game 
initializeGame();