import * as THREE from 'three'
import { Player, Projectile } from './components';
import { OverlayManager } from './managers';



export function handleShooting(event: MouseEvent, player: Player, scene: THREE.Scene, reticle: THREE.Object3D, projectiles: Projectile[], overlayManager: OverlayManager) {
  if (overlayManager.isPaused() || !overlayManager.isGameInitialized()) return;

  if (event.button === 0) {
    const reticlePosition = reticle.getWorldPosition(new THREE.Vector3());
    const projectile = player.shoot(scene, reticlePosition);
    if (projectile) projectiles.push(projectile);
  }
}

export function handleKeydown(event: KeyboardEvent, overlayManager: OverlayManager) {
    const keyActions: { [key: string]: () => void } = {
      Tab: () => {
        if (overlayManager.isGameInitialized()) {
          overlayManager.togglePause();
        }
      },
      // Future keys can be added here:
      // 'W': () => console.log('Move forward'),
      // 'A': () => console.log('Move left'),
    };
  
    // Check if the pressed key has a mapped action
    const action = keyActions[event.key];
    if (action) {
      action();
    }
  }

  // Setup global input listeners (e.g., keyboard, mouse)
export function setupInputListeners(
    player: Player,
    scene: THREE.Scene,
    reticle: THREE.Object3D,
    projectiles: Projectile[],
    overlayManager: OverlayManager
  ) {
    window.addEventListener('mousedown', (event) =>
      handleShooting(event, player, scene, reticle, projectiles, overlayManager)
    );
  
    window.addEventListener('keydown', (event) => handleKeydown(event, overlayManager));
}
  
  // Setup additional event listeners for specific elements or behaviors
export function setupEventListeners() {
    // Example: Add listeners for buttons, UI elements, or other custom events
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
      pauseButton.addEventListener('click', () => {
        console.log('Pause button clicked!');
        // Add pause button functionality
      });
    }
  
    // Additional event-specific setups go here
}