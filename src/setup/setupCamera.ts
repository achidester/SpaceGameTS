import * as THREE from 'three';

const CameraConfig = {
  fov: 55, // Field of view
  aspectRatio: window.innerWidth / window.innerHeight,
  nearClipping: 0.1,
  farClipping: 1000,
  initialPosition: new THREE.Vector3(0, 0, 0),
  lookAtTarget: new THREE.Vector3(0, 0, 5),
};

export function setupCamera(): { camera: THREE.PerspectiveCamera } {
    const camera = new THREE.PerspectiveCamera(
      CameraConfig.fov, 
      CameraConfig.aspectRatio,
      CameraConfig.nearClipping, 
      CameraConfig.farClipping
    );

    // Set a fixed position for the camera, slightly above and behind the player.
    camera.position.copy(CameraConfig.initialPosition); 
    camera.lookAt(CameraConfig.lookAtTarget); 

    // Handle window resizing to maintain the aspect ratio
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return { camera };
}
