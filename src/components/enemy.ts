import * as THREE from 'three';
import { ResourceManager } from '../managers';

export const ENEMY_SIZE = 1;
export const ENEMY_SPEED = 0.2;
export const MIN_SPAWN_DISTANCE = 15;
export const MAX_SPAWN_DISTANCE = 25;

export class EnemyFactory {
  private resourceManager: ResourceManager;
  constructor() {
    this.resourceManager = new ResourceManager();
  }

  async createEnemy(): Promise<THREE.Object3D> {
      // Load the enemy model
      const enemyModel = await this.resourceManager.loadModel('../models/enemyship_v1.glb');

      // Set transformations for the enemy
      enemyModel.scale.set(ENEMY_SIZE, ENEMY_SIZE, ENEMY_SIZE);
      enemyModel.rotation.x = -Math.PI / 10
      enemyModel.position.set(
          Math.random() * (MAX_SPAWN_DISTANCE - MIN_SPAWN_DISTANCE) + MIN_SPAWN_DISTANCE,
          0,
          Math.random() * (MAX_SPAWN_DISTANCE - MIN_SPAWN_DISTANCE) + MIN_SPAWN_DISTANCE
      );

      return enemyModel;
  }
}

// BASIC SPAWN A CUBE AS AN ENEMY
export function createEnemyMesh(): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(ENEMY_SIZE, ENEMY_SIZE, ENEMY_SIZE);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  return new THREE.Mesh(geometry, material);
}