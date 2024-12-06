// Core libraries
import * as THREE from 'three';
// Game setup and configuration
import { setupScene, setupDevGUI, setupStats, setupCamera, setupGameUI, setupRenderer } from './setup';
import { createReticle } from './reticle';
import { setupUserControls, updateObjectPosition } from './userControls';
import { EnemyManager, OverlayManager, CanvasManager } from './managers';
import { Player, UI, Projectile } from './components';
import { setupEventListeners, setupInputListeners } from './input';

const overlayManager = new OverlayManager();
const canvasManager = new CanvasManager(['gameCanvas']);
canvasManager.enablePointerLock();
canvasManager.enableAutoResize();
const canvas = canvasManager.getCanvas('gameCanvas')
const renderer = setupRenderer(canvas);



const projectiles: Projectile[] = [];

function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  player: Player,
  reticle: THREE.Object3D,
  enemyManager: EnemyManager,
  stats: Stats,
  ui: UI
) {
  function loop() {
    requestAnimationFrame(loop);

    if (!overlayManager.isGameInitialized() || overlayManager.isPaused()) {
      if (overlayManager.isPaused()) document.exitPointerLock();
      return;
    }

    if (player.health <= 0) {
      document.exitPointerLock();
      return;
    }

    projectiles.forEach((projectile, index) => {
      projectile.update();
      if (projectile.hasExceededRange()) {
        scene.remove(projectile.mesh);
        projectiles.splice(index, 1);
      }
    });

    updateObjectPosition(player, camera);
    player.mesh!.lookAt(reticle.getWorldPosition(new THREE.Vector3()));
    enemyManager.update();

    renderer.render(scene, camera);
    stats.update();
    ui.drawHealthBar(player.health);
  }
  loop();
}

// Main Game Initialization Function
async function initializeGame() {
  try {
    console.log('Starting game initialization...');
    const { scene, player } = await setupScene();
    const { camera } = setupCamera(player.mesh!.position);
    const ui = setupGameUI(player.maxHealth);
    const stats = setupStats();
    setupDevGUI(camera);
    const reticle = createReticle(camera, scene);
    setupUserControls();
    const enemyManager = new EnemyManager(scene, player, projectiles, 2000);
    setupInputListeners(player, scene, reticle, projectiles, overlayManager);
    setupEventListeners();
  
    overlayManager.setGameInitialized(true);

    console.log('Game initialization complete.');
    return { renderer, scene, camera, player, reticle, enemyManager, stats, ui };
  } catch (error) {
    console.error('Error during game initialization:', error);
    overlayManager.showError('Failed to initialize the game. Please reload.');
    throw error; // Propagate the error for debugging or error handling
  }
}

// Start the Game
initializeGame().then(({ renderer, scene, camera, player, reticle, enemyManager, stats, ui }) => {
  animate(renderer, scene, camera, player, reticle, enemyManager, stats, ui);
}).catch((error) => {
  console.error('Failed to start the game:', error);
});