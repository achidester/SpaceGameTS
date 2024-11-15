import * as THREE from 'three';
import { Projectile } from './projectile';

export class Player {
  mesh: THREE.Mesh;
  fireRate: number; // Fire rate in milliseconds
  lastShotTime: number; // Track the last time a projectile was shot
  enemyTarget: THREE.Vector3; // Target for enemies to seek
  maxHealth: number;
  health: number;
  healthBar: HTMLElement; // HTML health bar element

  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshNormalMaterial({ wireframe: true })
    );
    this.mesh.position.y = 0;
    this.mesh.position.z = 5;
    this.fireRate = 100; // Fire rate set to 500 ms (0.5 seconds)
    this.lastShotTime = 0;
    this.maxHealth = 100;
    this.health = this.maxHealth;

    // Initialize enemyTarget position slightly behind the player
    this.enemyTarget = new THREE.Vector3(
      this.mesh.position.x,
      this.mesh.position.y,
      this.mesh.position.z - 5 // Adjust this distance as needed
    );

    this.healthBar = document.getElementById('playerHealthBar')!;
  }

  updateHealthBar() {
    if (this.healthBar) {
      const healthPercentage = (this.health / this.maxHealth) * 100;
      this.healthBar.style.width = `${healthPercentage}%`;
    }
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
    this.updateHealthBar();

    if (this.health <= 0) {
      console.log("Player has died!");
      this.showDeathScreen();
      // Additional death logic, e.g., stopping the game
    }
  }

  canShoot(): boolean {
    const currentTime = Date.now();
    return currentTime - this.lastShotTime >= this.fireRate;
  }

  shoot(scene: THREE.Scene, target: THREE.Vector3): Projectile | null {
    if (!this.canShoot()) return null;

    const direction = new THREE.Vector3();
    direction.subVectors(target, this.mesh.position).normalize();

    const projectile = new Projectile(this.mesh.position, direction, 0.2);
    scene.add(projectile.mesh);

    this.lastShotTime = Date.now();
    return projectile;
  }

  get position(): THREE.Vector3 {
    return this.mesh.position;
  }

  updateEnemyTarget() {
    // Keep enemyTarget slightly behind the player
    this.enemyTarget.set(
      this.mesh.position.x,
      this.mesh.position.y,
      this.mesh.position.z - 5 // Keep it offset on the Z-axis
    );
  }
}