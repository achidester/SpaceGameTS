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

export function updateObjectPosition(object: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0; // Ignore vertical component for movement
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  // Accumulate movement direction based on WASD input
  if (keyState.w) moveDirection.add(forward);
  if (keyState.s) moveDirection.sub(forward);
  if (keyState.a) moveDirection.sub(right);
  if (keyState.d) moveDirection.add(right);

  if (moveDirection.length() > 0) {
    moveDirection.normalize();
    object.position.add(moveDirection.multiplyScalar(movementSpeed));

    // Align the object's rotation with the camera's horizontal rotation
    object.rotation.y = Math.atan2(forward.x, forward.z);
  }
}