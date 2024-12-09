import * as THREE from 'three';
import { Player } from './components/player'; 

const verticalMovementSpeed = 0.05; // Speed for W and S keys
const horizontalMovementSpeed = 0.05; // Separate speed for A and D keys
const keyState: Record<string, boolean> = { w: false, a: false, s: false, d: false };

export function setupUserControls() {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(event: KeyboardEvent) {
  if (keyState.hasOwnProperty(event.key)) keyState[event.key as keyof typeof keyState] = true;
}

function handleKeyUp(event: KeyboardEvent) {
  if (keyState.hasOwnProperty(event.key)) keyState[event.key as keyof typeof keyState] = false;
}

export function updateObjectPosition(player: Player, camera: THREE.PerspectiveCamera) {
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0; // Ignore vertical component for horizontal movement
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  // Accumulate movement direction based on WASD input with separate speeds
  if (keyState.w) moveDirection.y += verticalMovementSpeed; // Move up along Y-axis
  if (keyState.s) moveDirection.y -= verticalMovementSpeed; // Move down along Y-axis
  if (keyState.a) moveDirection.sub(right.multiplyScalar(horizontalMovementSpeed)); // Move left
  if (keyState.d) moveDirection.add(right.multiplyScalar(horizontalMovementSpeed)); // Move right

  // Apply movement to the objecteed
  if (moveDirection.length() > 0) {
    player.mesh!.position.add(moveDirection);
    player.mesh!.rotation.y = Math.atan2(forward.x, forward.z);

    // Update enemy target to stay behind the player
    player.updateEnemyTarget();
  }
}