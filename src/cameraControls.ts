import * as THREE from 'three';

export function setupCamera(): { camera: THREE.PerspectiveCamera, radius: number, spherical: THREE.Spherical } {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  // Set the distance (radius) from the center point
  const radius = 10;
  const spherical = new THREE.Spherical(radius, Math.PI / 2, 0); // Initialize with radius, phi, theta

  // Initial camera position based on spherical coordinates
  updateCameraPosition(camera, spherical);

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return { camera, radius, spherical };
}

export function setupCameraControls(spherical: THREE.Spherical, camera: THREE.PerspectiveCamera) {
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement) {
      document.addEventListener('mousemove', (event) => handleMouseMove(event, spherical, camera));
    } else {
      document.removeEventListener('mousemove', (event) => handleMouseMove(event, spherical, camera));
    }
  });
}

function handleMouseMove(event: MouseEvent, spherical: THREE.Spherical, camera: THREE.PerspectiveCamera) {
  const deltaX = event.movementX || 0;
  const deltaY = event.movementY || 0;

  // Adjust spherical coordinates based on mouse movement
  spherical.theta -= deltaX * 0.002; // Horizontal orbit
  spherical.phi -= deltaY * 0.002;   // Vertical orbit

  // Clamp phi to prevent flipping over the poles
  spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

  // Update the camera position based on new spherical coordinates
  updateCameraPosition(camera, spherical);
}

export function updateCameraPosition(camera: THREE.PerspectiveCamera, spherical: THREE.Spherical) {
  // Convert spherical coordinates to Cartesian and set the camera position
  const targetPosition = new THREE.Vector3(0, 0, 0); // Center point to orbit around
  camera.position.setFromSpherical(spherical).add(targetPosition);
  camera.lookAt(targetPosition); // Ensure the camera always looks at the center
}
