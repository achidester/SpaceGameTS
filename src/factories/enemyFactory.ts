import { ResourceManager } from '../managers';
import { Enemy } from '../components/enemy';

export const ENEMY_SIZE = .5;
export const ENEMY_SPEED = 0.2;
export const MIN_SPAWN_DISTANCE = 15;
export const MAX_SPAWN_DISTANCE = 25;

export class EnemyFactory {
    private resourceManager: ResourceManager;
  
    constructor() {
      this.resourceManager = new ResourceManager();
    }
  
    async createEnemy(customProperties: { speed?: number; size?: number } = {}): Promise<Enemy> {
      const enemyModel = await this.resourceManager.loadModel('../models/enemyship_v1.glb');
  
      enemyModel.rotation.x = -Math.PI / 10;
      enemyModel.position.set(
        Math.random() * (25 - 15) + 15,
        0,
        Math.random() * (25 - 15) + 15
      );
  
      return new Enemy(enemyModel, customProperties);
    }
  }
