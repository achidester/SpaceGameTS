import * as THREE from 'three';
import { Player } from './components/player'; 
import { getKeyState } from './input';

const verticalMovementSpeed = 0.05; 
const horizontalMovementSpeed = 0.05;

const boundaries = {
  xMin: -5, 
  xMax: 5,  
  yMin: -2,  
  yMax: 2, 
};

export function updateObjectPosition(player: Player, camera: THREE.PerspectiveCamera) {
  const keyState = getKeyState();
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  if (keyState.w) moveDirection.y += verticalMovementSpeed; 
  if (keyState.s) moveDirection.y -= verticalMovementSpeed; 
  if (keyState.a) moveDirection.sub(right.multiplyScalar(horizontalMovementSpeed));
  if (keyState.d) moveDirection.add(right.multiplyScalar(horizontalMovementSpeed)); 

  if (moveDirection.length() > 0) {
    const newPosition = player.mesh!.position.clone().add(moveDirection);
    newPosition.x = THREE.MathUtils.clamp(newPosition.x, boundaries.xMin, boundaries.xMax);
    newPosition.y = THREE.MathUtils.clamp(newPosition.y, boundaries.yMin, boundaries.yMax);

    player.mesh!.position.copy(newPosition);
    player.mesh!.rotation.y = Math.atan2(forward.x, forward.z);

    player.updateEnemyTarget();
  }
}