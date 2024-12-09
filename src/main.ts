import * as THREE from 'three';

import { setupScene, setupDevGUI, setupStats, setupCamera, setupGameUI, setupRenderer } from './setup';
import { createReticle } from './reticle';
import { updateObjectPosition } from './userControls';
import { EnemyManager, OverlayManager, CanvasManager, ResourceManager } from './managers';
import { setupEventListeners, setupInputListeners } from './input';
import GameState from './gameState';
import { PlayerFactory } from './setup/playerFactory';

const canvasManager = new CanvasManager(['gameCanvas']);
canvasManager.enablePointerLock();
canvasManager.enableAutoResize();
const canvas = canvasManager.getCanvas('gameCanvas')
const renderer = setupRenderer(canvas);
const resourceManager = new ResourceManager();
const playerFactory = new PlayerFactory(resourceManager);


function animate() {
  const gameState = GameState.getInstance();

  function loop() {
    requestAnimationFrame(loop);

    if (gameState.isLoading || gameState.isPaused()) {
      if (!gameState.isPaused()) document.exitPointerLock();
      return;
    }

    if (gameState.player.health <= 0) {
      document.exitPointerLock();
      return;
    }

    gameState.projectiles.forEach((projectile, index) => {
      projectile.update();
      if (projectile.hasExceededRange()) {
        gameState.scene.remove(projectile.mesh);
        gameState.projectiles.splice(index, 1);
      }
    });

    updateObjectPosition(gameState.player, gameState.camera);
    gameState.player.mesh!.lookAt(gameState.reticle.getWorldPosition(new THREE.Vector3()));
    gameState.enemyManager.update();

    renderer.render(gameState.scene, gameState.camera);
    gameState.stats.update();
    gameState.ui.drawHealthBar(gameState.player.health);
  }
  loop();
}

// Main Game Initialization Function
async function initializeGame() {

  const gameState = GameState.getInstance();

  try {
    console.log('Starting game initialization...');
    const { scene } = await setupScene();
    const player = await playerFactory.createPlayer();
    scene.add(player.mesh!);

    const { camera } = setupCamera(new THREE.Vector3(0,0,5));
    const ui = setupGameUI(player.maxHealth);
    const stats = setupStats();
    setupDevGUI(camera);
    const reticle = createReticle(camera, scene);
    const enemyManager = new EnemyManager(2000);
    setupInputListeners(player, scene, reticle, gameState.projectiles);
    setupEventListeners();

    gameState.renderer = renderer;
    gameState.scene = scene;
    gameState.camera = camera;
    gameState.player = player;
    gameState.reticle = reticle;
    gameState.ui = ui;
    gameState.stats = stats;
    gameState.enemyManager = enemyManager
  
    gameState.setGameInitialized(true);

    console.log('Game initialization complete.');
  } catch (error) {
    console.error('Error during game initialization:', error);
    OverlayManager.getInstance().showError('Failed to initialize the game. Please reload.');
    throw error; // Propagate the error for debugging or error handling
  }
}

// Start the Game
initializeGame().then(() => {
  animate();
}).catch((error) => {
  console.error('Failed to start the game:', error);
});