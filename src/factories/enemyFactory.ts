import * as THREE from 'three';
import { ResourceManager } from '../managers';
import { Enemy } from '../components/enemy';


export class EnemyFactory {
    private resourceManager: ResourceManager;
  
    constructor() {
      this.resourceManager = new ResourceManager();
    }
  
    async createEnemy(customProperties: { speed?: number; size?: number } = {}, spawnPosition: THREE.Vector3): Promise<Enemy> {
      const enemyModel = await this.resourceManager.loadModel('../models/enemyship_v1.glb');
      enemyModel.name = 'Enemy'; // Optional, for debugging
      enemyModel.uuid = THREE.MathUtils.generateUUID(); // Generate a consistent UUID
      enemyModel.rotation.x = -Math.PI /10 ;
      
      enemyModel.position.copy(spawnPosition);
      

      return new Enemy(enemyModel, customProperties);
    }
  }
