import * as THREE from 'three';
import { Projectile } from './projectile';
import { spawnEnemy, moveEnemy } from './enemy';
import { Player } from './player';

export class EnemyManager {
  private scene: THREE.Scene;
  private player: Player;
  private projectiles: Projectile[];
  private enemies: THREE.Mesh[];
  private enemySpawnTimer: number = 0; // Internal state
  private spawnInterval: number; // Configurable spawn interval

  constructor(scene: THREE.Scene, player: Player, projectiles: Projectile[], enemies: THREE.Mesh[], spawnInterval: number = 2000) {
    this.scene = scene;
    this.player = player;
    this.projectiles = projectiles;
    this.enemies = enemies;
    this.spawnInterval = spawnInterval;
  }

  private spawnEnemies() {
    if (Date.now() - this.enemySpawnTimer > this.spawnInterval) {
      const enemy = spawnEnemy();
      this.enemies.push(enemy);
      this.enemySpawnTimer = Date.now(); // Update spawn timer
    }
  }

  private moveEnemies() {
    this.enemies.forEach((enemy, enemyIndex) => {
      moveEnemy(enemy, this.player, this.scene, this.enemies);

      // Check for collisions with projectiles
      this.projectiles.forEach((projectile, projectileIndex) => {
        const distance = enemy.position.distanceTo(projectile.mesh.position);
        if (distance < 1) {
          // Remove enemy and projectile on collision
          this.scene.remove(enemy);
          this.enemies.splice(enemyIndex, 1);
          this.scene.remove(projectile.mesh);
          this.projectiles.splice(projectileIndex, 1);
        }
      });

      // Check for proximity to the player
      const distanceToPlayer = enemy.position.distanceTo(this.player.position);
      if (distanceToPlayer < 1) {
        this.player.takeDamage(50);
        this.scene.remove(enemy);
        this.enemies.splice(enemyIndex, 1);
      }
    });
  }

  public update() {
    this.spawnEnemies();
    this.moveEnemies();
  }
}