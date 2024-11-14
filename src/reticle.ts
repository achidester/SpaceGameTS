import * as THREE from 'three';

export function createReticle(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
  // Create reticle geometry and material
  const reticleGeometry = new THREE.SphereGeometry(1, 10, 10); // Adjust size as needed
  const reticleMaterial = new THREE.MeshBasicMaterial({
    color: 0xd6d63e,
    transparent: true,
    opacity: 0.3
  });

  // Create reticle mesh and add it to the scene
  const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
  reticle.position.set(0, 0, -10);
  scene.add(reticle);

  // Set up reticle movement based on mouse position
  let isPointerLocked = false;
  let accumulatedMouseX = 0;
  let accumulatedMouseY = 0;

  // Detect pointer lock status
  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = !!document.pointerLockElement;
  });

  // Mousemove event listener to move the reticle based on mouse position
  window.addEventListener('mousemove', (event) => {
    if (isPointerLocked) {
      // Use relative movement values when pointer is locked
      accumulatedMouseX += event.movementX * 0.002; // Adjust sensitivity as needed
      accumulatedMouseY -= event.movementY * 0.002;

      // Clamp values to keep reticle within bounds (e.g., [-1, 1])
      accumulatedMouseX = Math.max(-1, Math.min(1, accumulatedMouseX));
      accumulatedMouseY = Math.max(-1, Math.min(1, accumulatedMouseY));
    } else {
      // Use absolute position values when pointer is not locked
      accumulatedMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      accumulatedMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // Set a fixed distance from the camera for the reticle
    const reticleDistance = 20;

    // Create a 3D position based on normalized coordinates and unproject
    const reticlePosition = new THREE.Vector3(accumulatedMouseX, accumulatedMouseY, -1).unproject(camera);

    // Calculate direction and position the reticle
    const direction = reticlePosition.sub(camera.position).normalize();
    reticle.position.copy(camera.position).add(direction.multiplyScalar(reticleDistance));
  });

  return reticle;
}