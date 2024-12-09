import * as THREE from 'three'
import { OverlayManager } from './managers';
import GameState from './gameState';

const keyState: Record<string, boolean> = { w: false, a: false, s: false, d: false }; // Tracks key states
const gameState = GameState.getInstance();

export function handleShooting(event: MouseEvent) {
  if (gameState.isPaused() || !gameState.isGameInitialized()) return;

  if (event.button === 0) {
    gameState.player.shoot()
  }
}

export function handleKeyDown(event: KeyboardEvent) {
  const keyActions: { [key: string]: () => void } = {
    Tab: () => {
      const overlayManager = OverlayManager.getInstance(); // Assuming OverlayManager can be accessed globally
      if (gameState.isGameInitialized()) {
        overlayManager.togglePause();
      }
    },
    // Add other keys with specific actions here:
    // W: () => console.log('Move forward'),
  };
  // Check if the key is mapped to an action
  const action = keyActions[event.key];
  if (action) {
    action();
  } else if (keyState.hasOwnProperty(event.key)) {
    keyState[event.key as keyof typeof keyState] = true; // Update key state for movement keys
  }
}

export function handleKeyUp(event: KeyboardEvent) {
  if (keyState.hasOwnProperty(event.key)) {
    keyState[event.key as keyof typeof keyState] = false; // Reset key state
  }
}

// Setup global input listeners (e.g., keyboard, mouse)
export function setupInputListeners() {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  //TODO: will need to fix mouse input when adding more mouse inputs, as of now, it just shoots with mouse0
  window.addEventListener('mousedown', (event) =>
    handleShooting(event)
  );
}
export function getKeyState() { 
  return keyState;
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