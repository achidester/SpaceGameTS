import * as THREE from 'three';
import { Enemy } from '../components/enemy';
import GameState from '../gameState';
import { Player, Projectile } from '../components';
import { EnemyFactory } from '../factories/enemyFactory';

const MIN_SPAWN_DISTANCE = 15;
const MAX_SPAWN_DISTANCE = 25;

export class EnemyManager {
  private gameState = GameState.getInstance();
  private enemies: Enemy[] = [];
  private enemySpawnTimer: number = 0;
  private spawnInterval: number;
  private enemyFactory: EnemyFactory;
  
  constructor(spawnInterval: number = 500) {
    this.spawnInterval = spawnInterval;
    this.enemyFactory = new EnemyFactory()

  }

  public update(playTime: number): void {
    const minSpawnInterval = 200; // Min spawn interval in milliseconds
    const baseSpawnInterval = 2000; // Base spawn interval in milliseconds
    const intensityFactor = 1; // Scaling intensity for faster enemy spawns (set to 50 for crazy fast spawns)
    const currentSpawnInterval = Math.max( minSpawnInterval, baseSpawnInterval / Math.pow(1 + playTime / 60000, intensityFactor));
    this.spawnInterval = currentSpawnInterval;
    const isSpawnTime = Date.now() - this.enemySpawnTimer > this.spawnInterval;

    if (isSpawnTime) {
      this.spawnEnemy();
      this.enemySpawnTimer = Date.now();
    }

    this.enemies.forEach((enemy, index) => {
      const player = this.gameState.player;
      this.updateEnemyPosition(enemy, index, player);
      this.rotateEnemyToFacePlayer(enemy, player);
      this.checkCollisionWithPlayer(enemy, index, player);
    });

    this.checkCollisionsWithProjectile();
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
      // Use EnemyFactory to create an enemy model
      const enemy = await this.enemyFactory.createEnemy();
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

  private removeProjectile(projectile: Projectile, index: number): void {
    this.gameState.scene.remove(projectile.mesh);
    projectile.destroy();
    this.gameState.projectiles.splice(index, 1);
  }

  private checkCollisionsWithProjectile(): void {
    this.enemies.forEach((enemy, enemyIndex) => {
      this.gameState.projectiles.forEach((projectile, projectileIndex) => {
        const distance = enemy.object.position.distanceTo(projectile.mesh.position);
        if (distance < 1) {
          this.removeEnemy(enemy, enemyIndex);
          this.removeProjectile(projectile, projectileIndex);
          this.gameState.addScore(50);
        }
      });
    });
  }

  private checkCollisionWithPlayer(enemy: Enemy, index: number, player: Player) {
    const distanceToPlayer = enemy.object.position.distanceTo(player.position!);
      if (distanceToPlayer < 1) {
        player.takeDamage(0);
        this.removeEnemy(enemy, index);
      }
  }

  private rotateEnemyToFacePlayer(enemy: Enemy, player: Player) {
      const direction = new THREE.Vector3();
      direction.subVectors(player.position!, enemy.object.position).normalize();
      // Rotate the enemy to face the player (ALL AXIS) 
      // probably better long term !!!!!
      // const lookAtPosition = new THREE.Vector3().copy(player.position!);
      // enemy.lookAt(lookAtPosition);

      // Calculate rotation to face the player around the y-axis (YAW) 
      // used for looks short term, rotate enemy mesh instead of avoiding other axis !!!
      const angle = Math.atan2(direction.x, direction.z); // Calculate the yaw angle
      enemy.object.rotation.y = angle; // Set the y-axis rotation
  }

  private updateEnemyPosition(enemy: Enemy, index: number, player: Player) {
    const direction = new THREE.Vector3();

    direction.subVectors(player.enemyTarget!, enemy.object.position).normalize();
    enemy.object.position.add(direction.multiplyScalar(enemy.speed));

    // Remove enemy if it passes the target
    if (enemy.object.position.z <= player.enemyTarget!.z) {
      this.removeEnemy(enemy, index);
    }
  }

  public getEnemies(): Enemy[] {
    return this.enemies;
  }
}