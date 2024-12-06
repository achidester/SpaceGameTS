import * as THREE from 'three';

export function setupCamera(center: THREE.Vector3): { camera: THREE.PerspectiveCamera } {
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Set a fixed position for the camera, slightly above and behind the player.
    // Adjust the values here to set the initial view as desired.
    camera.position.set(0, 0, 0); // Example position: 10 units up and 20 units back along Z-axis
    camera.lookAt(center); // Ensure the camera initially looks at the player’s position

    // Handle window resizing to maintain the aspect ratio
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return { camera };
}
