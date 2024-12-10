import * as THREE from 'three';
import { createEnemyMesh, ENEMY_SPEED, MIN_SPAWN_DISTANCE, MAX_SPAWN_DISTANCE } from '../components/enemy';
import GameState from '../gameState';
import { Projectile } from '../components';

export class EnemyManager {
  private gameState = GameState.getInstance();
  private enemies: THREE.Mesh[] = [];
  private enemySpawnTimer: number = 0;
  private spawnInterval: number;

  constructor(spawnInterval: number = 500) {
    this.spawnInterval = spawnInterval;
    
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

  private spawnEnemy(): void {
    const playerPosition = this.gameState.player.position!;
    const spawnPosition = this.getSpawnPosition(playerPosition);

    const enemy = createEnemyMesh();
    enemy.position.copy(spawnPosition);

    this.gameState.scene.add(enemy);
    this.enemies.push(enemy);
  }

  private removeEnemy(enemy: THREE.Mesh, index: number): void {
    this.gameState.scene.remove(enemy);
    this.enemies.splice(index, 1);
  }

  private removeProjectile(projectile: Projectile, index: number): void {
    this.gameState.scene.remove(projectile.mesh);
    projectile.destroy();
    this.gameState.projectiles.splice(index, 1);
  }

  private checkCollisions(): void {
    this.enemies.forEach((enemy, enemyIndex) => {
      this.gameState.projectiles.forEach((projectile, projectileIndex) => {
        const distance = enemy.position.distanceTo(projectile.mesh.position);

        if (distance < 1) {
          // Collision detected
          this.removeEnemy(enemy, enemyIndex);
          this.removeProjectile(projectile, projectileIndex);
        }
      });
    });
  }

  public update(playTime: number): void {
    const baseSpawnInterval = 2000; // Base spawn interval in milliseconds
    const intensityFactor = 0.2; // Scaling intensity for faster enemy spawns
    this.spawnInterval = Math.max(
      200, // Minimum spawn interval to prevent overwhelming the system
      baseSpawnInterval / Math.pow(1 + playTime / 60000, intensityFactor)
    );

    // Check if it's time to spawn a new enemy
    if (Date.now() - this.enemySpawnTimer > this.spawnInterval) {
      this.spawnEnemy();
      this.enemySpawnTimer = Date.now();
    }

    // Move enemies and check collisions
    this.enemies.forEach((enemy, index) => {
      const player = this.gameState.player;
      const direction = new THREE.Vector3();
      direction.subVectors(player.enemyTarget!, enemy.position).normalize();

      enemy.position.add(direction.multiplyScalar(ENEMY_SPEED));
      
      if (enemy.position.z <= player.enemyTarget!.z) {
        this.removeEnemy(enemy, index);
      }

      const distanceToPlayer = enemy.position.distanceTo(player.position!);
      if (distanceToPlayer < 1) {
        player.takeDamage(0);
        this.removeEnemy(enemy, index);
      }
    });

    // Check for collisions
    this.checkCollisions();
  }

  public getEnemies(): THREE.Mesh[] {
    return this.enemies;
  }
}