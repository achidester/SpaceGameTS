import * as THREE from 'three';
import GameState from '../gameState';
import { Player, Enemy } from '../components';
import { EnemyFactory } from '../factories/enemyFactory';

const MIN_SPAWN_DISTANCE = 15;
const MAX_SPAWN_DISTANCE = 25;
const COLLISION_WITH_PLAYER_TOLERANCE = 1;
const ENEMY_PLAYER_DAMAGE_CONTACT = 0;
const ENEMY_KILL_SCORE = 50;

export class EnemyManager {
  private readonly gameState = GameState.getInstance();
  private enemies: Enemy[] = [];
  private enemySpawnTimer: number = 0;
  private spawnInterval: number;
  private enemyFactory: EnemyFactory;

  constructor(spawnInterval: number = 500) {
    this.spawnInterval = spawnInterval;
    this.enemyFactory = new EnemyFactory()
  }


  public update(): void {
    const playTime = this.gameState.getPlayTime();
    const minSpawnInterval = 200; // Min spawn interval in milliseconds
    const baseSpawnInterval = 1000; // Base spawn interval in milliseconds
    const intensityFactor = 1; // Scaling intensity for faster enemy spawns (set to 50 for crazy fast spawns)
    const currentSpawnInterval = Math.max(minSpawnInterval, baseSpawnInterval / Math.pow(1 + playTime / 60000, intensityFactor));
    this.spawnInterval = currentSpawnInterval;
    const isSpawnTime = Date.now() - this.enemySpawnTimer > this.spawnInterval;
    const player = this.gameState.player;

    if (isSpawnTime) {
      this.spawnEnemy();
      this.enemySpawnTimer = Date.now();
    }

    this.enemies.forEach((enemy, index) => {
      this.updateEnemyPosition(enemy, index, player);
      this.rotateEnemyToFacePlayer(enemy, player);
      this.checkCollisionWithPlayer(enemy, index, player);
    });

  }

  private getSpawnPosition(playerPosition: THREE.Vector3): THREE.Vector3 {
    const forward = new THREE.Vector3(0, 0, 3);
    const distance = Math.random() * (MAX_SPAWN_DISTANCE - MIN_SPAWN_DISTANCE) + MIN_SPAWN_DISTANCE;
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 15;

    return new THREE.Vector3(
      playerPosition.x + forward.x * distance + offsetX,
      playerPosition.y + offsetY,
      playerPosition.z + forward.z * distance
    );
  }

  private async spawnEnemy(): Promise<void> {
    const playerPosition = this.gameState.player.position!;
    const spawnPosition = this.getSpawnPosition(playerPosition);

    try {
      const enemy = await this.enemyFactory.createEnemy({ }, spawnPosition);
      enemy.object.position.copy(spawnPosition);
  
      
      this.gameState.scene.add(enemy.object);
      
      this.enemies.push(enemy);
    } catch (error) {
      console.error('Failed to spawn enemy:', error);
    }
  }

  private removeEnemy(enemy: Enemy, index: number): void {
    this.gameState.scene.remove(enemy.object);
    this.enemies.splice(index, 1);
  }


  public handleEnemyHit(enemyObject: THREE.Object3D): void {
    let resolvedObject = enemyObject;
    while (resolvedObject.parent && resolvedObject.parent.type !== 'Scene') {
      resolvedObject = resolvedObject.parent;
    }
    const enemyIndex = this.enemies.findIndex(enemy => enemy.object.uuid === resolvedObject.uuid);
    if (enemyIndex !== -1) {
      this.removeEnemy(this.enemies[enemyIndex], enemyIndex);
      this.gameState.addScore(ENEMY_KILL_SCORE);

    } 
  }

  private checkCollisionWithPlayer(enemy: Enemy, index: number, player: Player) {
    const distanceToPlayer = enemy.object.position.distanceTo(player.position!);
    if (distanceToPlayer < COLLISION_WITH_PLAYER_TOLERANCE) {
      player.takeDamage(ENEMY_PLAYER_DAMAGE_CONTACT);
      this.removeEnemy(enemy, index);
    }
  }

  private rotateEnemyToFacePlayer(enemy: Enemy, player: Player) {
    const direction = new THREE.Vector3();
    direction.subVectors(player.enemyTarget!, enemy.object.position).normalize()
    // Calculate rotation to face the player around the y-axis (YAW) 
    // used for looks short term, rotate enemy mesh instead of avoiding other axis !!!
    const angle = Math.atan2(direction.x, direction.z); // Calculate the yaw angle
    enemy.object.rotation.y = angle; // Set the y-axis rotation
  }

  private updateEnemyPosition(enemy: Enemy, index: number, player: Player) {
    const direction = new THREE.Vector3();
    direction.subVectors(player.enemyTarget!, enemy.object.position).normalize();
    enemy.object.position.add(direction.multiplyScalar(enemy.speed));
    if (enemy.object.position.z <= player.enemyTarget!.z) {
      this.removeEnemy(enemy, index);
    }
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }
}