import * as THREE from 'three';

const movementSpeed = 0.1;
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

export function updateCubePosition(cube: THREE.Mesh) {
  if (keyState.w) cube.position.z -= movementSpeed;
  if (keyState.s) cube.position.z += movementSpeed;
  if (keyState.a) cube.position.x -= movementSpeed;
  if (keyState.d) cube.position.x += movementSpeed;
}