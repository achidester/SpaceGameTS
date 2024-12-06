// Core libraries
import * as THREE from 'three';
// Game setup and configuration
import { setupScene, setupDevGUI, setupStats, setupCamera, setupGameUI } from './setup';
// Game components
import { createReticle } from './reticle';
import { setupUserControls, updateObjectPosition } from './userControls';
import { EnemyManager, OverlayManager } from './managers';
import { Player, UI, Projectile } from './components';


const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const overlayManager = new OverlayManager();


// TODO: Bounce to sep file
function setupRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  return renderer;
}
const renderer = setupRenderer(canvas);
// TODO: Bounce to sep file
function enablePointerLock(canvas: HTMLCanvasElement) {
  canvas.addEventListener('click', () => {
    canvas.requestPointerLock();
  });
}
enablePointerLock(canvas);

// Game state variables
let gameInitialized = false; // Tracks if initialization is complete

// Arrays for projectiles
const projectiles: Projectile[] = [];

// TODO: Consider bouncing
function initializeEnemyManager(
  scene: THREE.Scene,
  player: Player,
  projectiles: Projectile[],
  spawnInterval: number = 2000 // Default spawn interval
): EnemyManager {
  return new EnemyManager(scene, player, projectiles, spawnInterval);
}

// TODO: Consider bouncing
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


// Animation Function
function animate(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  player: Player,
  reticle: THREE.Object3D,
  enemyManager: EnemyManager,
  projectiles: Projectile[],
  stats: Stats,
  ui: UI
) {
  function loop() {
    requestAnimationFrame(loop);

    if (!gameInitialized || overlayManager.isPaused()) {
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
    const enemyManager = initializeEnemyManager(scene, player, projectiles);
    setupEventListeners(player, scene, reticle);

    gameInitialized = true;
    overlayManager.setGameInitialized(gameInitialized);

    console.log('Game initialization complete.');
    return { renderer, scene, camera, player, reticle, enemyManager, projectiles, stats, ui };
  } catch (error) {
    console.error('Error during game initialization:', error);
    overlayManager.showError('Failed to initialize the game. Please reload.');
    throw error; // Propagate the error for debugging or error handling
  }
}

// Start the Game
initializeGame().then(({ renderer, scene, camera, player, reticle, enemyManager, projectiles, stats, ui }) => {
  animate(renderer, scene, camera, player, reticle, enemyManager, projectiles, stats, ui);
}).catch((error) => {
  console.error('Failed to start the game:', error);
});