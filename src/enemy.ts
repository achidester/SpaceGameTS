import * as THREE from 'three';
import { scene, player } from './sceneSetup';
import { Player } from './player'; // Just for typedef

const enemySize = 1;
const minSpawnDistance = 10;
const maxSpawnDistance = 20; // Define a max distance to control where enemies spawn
const enemySpeed = .08; // Define a max distance to control where enemies spawn

// Function to spawn an enemy
export function spawnEnemy() {
    const geometry = new THREE.BoxGeometry(enemySize, enemySize, enemySize);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);

    // Use player position to spawn enemies near the screen center
    const spawnPosition = spawnPositionNearCenter(player.position, minSpawnDistance, maxSpawnDistance);
    enemy.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);

    scene.add(enemy);
    return enemy;
}

function spawnPositionNearCenter(playerPosition: THREE.Vector3, minDistance: number, maxDistance: number) {
    // Define a forward direction in world space (e.g., along the negative z-axis)
    const forward = new THREE.Vector3(0, 0, 3);

    // Randomize a distance within the defined range
    const distance = Math.random() * (maxDistance - minDistance) + minDistance;

    // Add some randomness to create a spread around the center of the screen
    const offsetX = (Math.random() - 0.5) * 10; // Horizontal spread
    const offsetY = (Math.random() - 0.5) * 5;  // Vertical spread

    // Calculate spawn position based on the player’s position
    const spawnPosition = new THREE.Vector3(
        playerPosition.x + forward.x * distance + offsetX,
        playerPosition.y + offsetY,
        playerPosition.z + forward.z * distance
    );

    return spawnPosition;
}

// Move the enemy toward the player
export function moveEnemy(enemy: THREE.Mesh, player: Player, scene: THREE.Scene, enemies: THREE.Mesh[]) {
    const direction = new THREE.Vector3();
    direction.subVectors(player.enemyTarget, enemy.position).normalize();
  
    // Move the enemy in the direction of the target
    enemy.position.add(direction.multiplyScalar(enemySpeed));
  
    // Check if the enemy has reached or passed the target’s Z position
    if (enemy.position.z <= player.enemyTarget.z) {
      // Remove the enemy from the scene
      scene.remove(enemy);
  
      // Optionally, remove the enemy from the enemies array
      const index = enemies.indexOf(enemy);
      if (index > -1) {
        enemies.splice(index, 1);
      }
  
      console.log("Enemy destroyed after passing target Z position!");
    }
  }