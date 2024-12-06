import * as THREE from 'three';
import { Projectile } from '../components/projectile';
import { spawnEnemy, moveEnemy } from '../components/enemy';
import { Player } from '../components/player';
import GameState from '../gameState';

export class EnemyManager {
  private gameState = GameState.getInstance();
  private enemies: THREE.Mesh[] = [];
  private enemySpawnTimer: number = 0; // Internal state
  private spawnInterval: number; // Configurable spawn interval

  constructor(spawnInterval: number = 2000) {
    this.spawnInterval = spawnInterval;
  }

  private spawnEnemies() {
    if (Date.now() - this.enemySpawnTimer > this.spawnInterval) {
      const enemy = spawnEnemy(this.gameState.player.position!, this.gameState.scene );
      this.enemies.push(enemy);
      this.enemySpawnTimer = Date.now(); // Update spawn timer
    }
  }

  private moveEnemies() {
    this.enemies.forEach((enemy, enemyIndex) => {
      moveEnemy(enemy, this.gameState.player, this.gameState.scene, this.enemies);

      // Check for collisions with projectiles
      this.gameState.projectiles.forEach((projectile, projectileIndex) => {
        const distance = enemy.position.distanceTo(projectile.mesh.position);
        if (distance < 1) {
          // Remove enemy and projectile on collision
          this.gameState.scene.remove(enemy);
          this.enemies.splice(enemyIndex, 1);
          this.gameState.scene.remove(projectile.mesh);
          this.gameState.projectiles.splice(projectileIndex, 1);
        }
      });

      // Check for proximity to the player
      const distanceToPlayer = enemy.position.distanceTo(this.gameState.player.position!);
      if (distanceToPlayer < 1) {
        this.gameState.player.takeDamage(25);
        this.gameState.scene.remove(enemy);
        this.enemies.splice(enemyIndex, 1);
      }
    });
  }

  //getter for enemies, may be uneeded
  public getEnemies(): THREE.Mesh[] {
    return this.enemies;
  }

  public update() {
    this.spawnEnemies();
    this.moveEnemies();
  }
}