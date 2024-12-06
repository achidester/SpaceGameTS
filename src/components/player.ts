import * as THREE from 'three';
import { Projectile } from './projectile';
import { ResourceManager } from '../managers/resourceManager';

export class Player {
  mesh: THREE.Object3D | null = null; // Mesh starts as null until player model is loaded. 
  fireRate: number;
  lastShotTime: number;
  enemyTarget: THREE.Vector3 | null = null; // Target starts as null (TODO: consider other options for enemy targeting system)
  maxHealth: number;
  health: number;
  healthBar: HTMLElement;

  constructor(private playerModel: THREE.Object3D) {
    this.mesh = this.playerModel
    this.fireRate = 500;
    this.lastShotTime = 0;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.healthBar = document.getElementById('playerHealthBar')!;
    this.enemyTarget = new THREE.Vector3(
      this.mesh.position.x,
      this.mesh.position.y,
      this.mesh.position.z - 5
    );
  }

  showDeathScreen() {
    if (this.health > 0) return;
    const deathOverlay = document.getElementById("deathOverlay");
    if (deathOverlay) {
      console.log("Showing death screen.");
      deathOverlay.style.display = "flex";
    }
    const refreshButton = document.getElementById("refreshButton");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => {
        location.reload(); // Reload the page
      });
    }
  }

  takeDamage(damage: number) {
    this.health -= damage;
    this.health = Math.max(0, this.health); // Ensure health doesn't go below 0
    if (this.health <= 0) {
      console.log("Player has died!");
      this.showDeathScreen();
    }
  }

  canShoot(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastShotTime >= this.fireRate;
  }

  shoot(scene: THREE.Scene, target: THREE.Vector3): Projectile | null {
    if (!this.canShoot() || !this.mesh) return null; // Ensure mesh is ready

    const direction = new THREE.Vector3();
    direction.subVectors(target, this.mesh.position).normalize();
    const projectile = new Projectile(this.mesh.position, direction, 0.2);
    scene.add(projectile.mesh);
    this.lastShotTime = Date.now();
    return projectile;
  }

  get position(): THREE.Vector3 | null {
    return this.mesh?.position || null;
  }

  updateEnemyTarget() {
    if (this.mesh && this.enemyTarget) {
      this.enemyTarget.set(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z - 5
      );
    }
  }
  
}