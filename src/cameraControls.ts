import * as THREE from 'three';

let spherical: THREE.Spherical;
const rotationSpeed = 0.005;

export function setupCamera() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  spherical = new THREE.Spherical();
  spherical.setFromVector3(camera.position);

  window.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('pointerlockchange', onPointerLockChange);

  return camera;
}

function onPointerLockChange() {
    if (document.pointerLockElement) {
      // Enable mouse movement when pointer is locked
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      // Remove mouse movement handler when pointer is unlocked
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }

  function handleMouseMove(event: MouseEvent) {
    // Use movementX and movementY for relative movement
    const deltaX = event.movementX || 0;
    const deltaY = event.movementY || 0;
  
    spherical.theta -= deltaX * rotationSpeed;
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * rotationSpeed));
  }

export function updateCameraPosition(camera: THREE.PerspectiveCamera, target: THREE.Object3D) {
  camera.position.copy(target.position).add(new THREE.Vector3().setFromSpherical(spherical));
  camera.lookAt(target.position);
}