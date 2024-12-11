import * as THREE from 'three';

export function createReticle(camera: THREE.PerspectiveCamera, scene: THREE.Scene) {
  const textureLoader = new THREE.TextureLoader();
  const reticleTexture = textureLoader.load('/reticle.png');
  const spriteMaterial = new THREE.SpriteMaterial({
    map: reticleTexture,
    transparent: true,
    depthTest: false, // always on top, ignore Z-buffer
    opacity: .25,
  });

  const reticle = new THREE.Sprite(spriteMaterial);
  reticle.scale.set(2.5, 2.5, 2.5); 
  
  // Initialize the reticle at a default distance
  const reticleDistance = 50;
  const initialZ = .1; // Small z value for closer projection
  const initialPosition = new THREE.Vector3(0, 0, initialZ).unproject(camera);
  const initialDirection = initialPosition.sub(camera.position).normalize();
  reticle.position.copy(camera.position).add(initialDirection.multiplyScalar(reticleDistance));

  scene.add(reticle);

  let isPointerLocked = false;
  let accumulatedMouseX = 0;
  let accumulatedMouseY = 0;
  

  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = !!document.pointerLockElement;
  });

  window.addEventListener('mousemove', (event) => {
    if (isPointerLocked) {

      accumulatedMouseX += event.movementX * 0.002; 
      accumulatedMouseY -= event.movementY * 0.002;

      accumulatedMouseX = Math.max(-1, Math.min(1, accumulatedMouseX));
      accumulatedMouseY = Math.max(-1, Math.min(1, accumulatedMouseY)); 
    } else {
      accumulatedMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      accumulatedMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    const reticlePosition = new THREE.Vector3(accumulatedMouseX, accumulatedMouseY, initialZ).unproject(camera);

    const direction = reticlePosition.sub(camera.position).normalize();
    reticle.position.copy(camera.position).add(direction.multiplyScalar(reticleDistance));
  });

  return reticle;
}