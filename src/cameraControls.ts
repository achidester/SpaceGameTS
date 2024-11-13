import * as THREE from 'three';

export function setupCamera(center: THREE.Vector3): { camera: THREE.PerspectiveCamera, radius: number, spherical: THREE.Spherical } {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Set the distance (radius) from the center point
    const radius = 10;
    const spherical = new THREE.Spherical(radius, Math.PI / 2, 0); // Initialize with radius, phi, theta
  
    // Initial camera position based on spherical coordinates centered on the cube
    updateCameraPosition(camera, spherical, center);
  
    // Handle window resizing
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
  
    return { camera, radius, spherical };
  }

export function setupCameraControls(spherical: THREE.Spherical, camera: THREE.PerspectiveCamera, center: THREE.Vector3) {
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement) {
        document.addEventListener('mousemove', (event) => handleMouseMove(event, spherical, camera, center));
      } else {
        document.removeEventListener('mousemove', (event) => handleMouseMove(event, spherical, camera, center));
      }
    });
  }

function handleMouseMove(event: MouseEvent, spherical: THREE.Spherical, camera: THREE.PerspectiveCamera, center: THREE.Vector3) {
    const deltaX = event.movementX || 0;
    const deltaY = event.movementY || 0;
  
    // Adjust spherical coordinates based on mouse movement
    spherical.theta -= deltaX * 0.002; // Horizontal orbit
    spherical.phi -= deltaY * 0.002;   // Vertical orbit
  
    // Clamp phi to prevent flipping over the poles
    spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
  
    // Update the camera position based on new spherical coordinates, centered on the cube
    updateCameraPosition(camera, spherical, center);
  }

export function updateCameraPosition(camera: THREE.PerspectiveCamera, spherical: THREE.Spherical, center: THREE.Vector3) {
    // Convert spherical coordinates to Cartesian, centered on the cube’s current position
    camera.position.setFromSpherical(spherical).add(center);
    camera.lookAt(center); // Ensure the camera always looks at the cube’s position
  }
