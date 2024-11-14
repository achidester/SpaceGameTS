import * as THREE from 'three';
import { scene } from './sceneSetup';
import { player } from './sceneSetup'; // Import player to access position

const enemySize = 1;
const minSpawnDistance = 10;
const maxSpawnDistance = 20; // Define a max distance to control where enemies spawn

// Function to spawn an enemy
export function spawnEnemy() {
    const geometry = new THREE.BoxGeometry(enemySize, enemySize, enemySize);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geometry, material);

    const { x, z } = spawnPositionInFrontOfPlayer(player.position, minSpawnDistance, maxSpawnDistance);
    enemy.position.set(x, 0, z);

    scene.add(enemy);
    return enemy;
}

// Generate a random position in front of the player
function spawnPositionInFrontOfPlayer(playerPosition: THREE.Vector3, minDistance: number, maxDistance: number) {
    // Calculate forward direction based on the player's rotation
    const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(player.mesh.quaternion).normalize();

    // Randomize a distance within the defined range
    const distance = Math.random() * (maxDistance - minDistance) + minDistance;

    // Add some randomness to the position in front of the player
    const offsetX = (Math.random() - 0.5) * 5; // Adjust the spread as needed
    const offsetZ = distance;

    // Calculate the spawn position based on the forward direction
    const spawnX = playerPosition.x + forward.x * offsetZ + offsetX;
    const spawnZ = playerPosition.z + forward.z * offsetZ;

    return { x: spawnX, z: spawnZ };
}

// Move the enemy toward the player
export function moveEnemy(enemy: THREE.Mesh) {
    const direction = new THREE.Vector3();
    direction.subVectors(player.position, enemy.position).normalize();
    enemy.position.add(direction.multiplyScalar(0.02));
}