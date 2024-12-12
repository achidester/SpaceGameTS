import * as THREE from 'three';

import { setupScene, setupDevGUI, setupStats, setupCamera, setupGameUI, setupRenderer } from './setup';
import { createReticle } from './reticle';
import { updateObjectPosition } from './userControls';
import { EnemyManager, OverlayManager, CanvasManager, ResourceManager } from './managers';
import { setupEventListeners, setupInputListeners } from './input';
import GameState from './gameState';
import { PlayerFactory } from './factories/playerFactory';


const canvasManager = new CanvasManager(['gameCanvas']);
canvasManager.enablePointerLock();
canvasManager.enableAutoResize();
const canvas = canvasManager.getCanvas('gameCanvas')
// const renderer = setupRenderer(canvas);
const resourceManager = new ResourceManager();
const playerFactory = new PlayerFactory(resourceManager);


function animate() {
  const gameState = GameState.getInstance();

  function loop() {
    requestAnimationFrame(loop);

    if (gameState.isLoading || gameState.isPaused() || gameState.player.health <= 0) {
      document.exitPointerLock();
      return;
    }

    gameState.projectiles.forEach(projectile => {
      console.log('Updating projectile:', projectile.mesh.uuid);
      projectile.update();
    });

    gameState.enemyManager.update();

    updateObjectPosition(gameState.player, gameState.camera);
    gameState.player.mesh!.lookAt(gameState.reticle.getWorldPosition(new THREE.Vector3()));

    if (gameState.composer) {
      gameState.composer.render();
    } else {
      gameState.renderer.render(gameState.scene, gameState.camera);
    }

    gameState.stats.update();
    gameState.ui.drawUI(gameState.player.health, gameState.getPlayTime(), gameState.getScore());
  }

  loop();
}

// Main Game Initialization Function
async function initializeGame() {
  const gameState = GameState.getInstance();
  try {
    console.log('Starting game initialization...');

    const renderer = setupRenderer(canvas);
    const { camera } = setupCamera();
    const { scene, composer } = await setupScene(renderer, camera); 

    const enemyManager = new EnemyManager(2000); // Initialize EnemyManager first
    gameState.enemyManager = enemyManager; // Assign to GameState early

    const player = await playerFactory.createPlayer(); // Create Player after EnemyManager is assigned
    const ui = setupGameUI(player.maxHealth);
    const stats = setupStats();
    const reticle = createReticle(camera, scene);

    scene.add(player.mesh!);
    setupDevGUI(camera);
    setupInputListeners();
    setupEventListeners();
    gameState.resetTimer();
    gameState.renderer = renderer;
    gameState.composer = composer; 
    gameState.scene = scene;
    gameState.camera = camera;
    gameState.player = player;
    gameState.reticle = reticle;
    gameState.ui = ui;
    gameState.stats = stats;
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