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

// export function setupCameraControls(camera: THREE.PerspectiveCamera, center: THREE.Vector3, cube: THREE.Object3D) {
//     document.addEventListener('pointerlockchange', () => {
//       if (document.pointerLockElement) {
//         document.addEventListener('mousemove', (event) => handleMouseMove(event, camera, center, cube));
//       } else {
//         document.removeEventListener('mousemove', (event) => handleMouseMove(event, camera, center, cube));
//       }
//     });
// }

// function handleMouseMove(event: MouseEvent, camera: THREE.PerspectiveCamera, center: THREE.Vector3, cube: THREE.Object3D) {
//     const deltaX = event.movementX || 0;
//     const deltaY = event.movementY || 0;

//     // Adjust camera orientation based on mouse movement (for rotation around the player)
//     camera.rotation.y -= deltaX * 0.001; // Horizontal orbit
//     camera.rotation.x -= deltaY * 0.001; // Vertical orbit

//     // Clamp the vertical rotation to prevent flipping over
//     camera.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, camera.rotation.x));

//     camera.lookAt(center); // Keep the camera looking at the player's position

//     // Make the cube face the same direction as the camera
//     const forward = new THREE.Vector3();
//     camera.getWorldDirection(forward);
//     cube.rotation.y = Math.atan2(forward.x, forward.z);
// }