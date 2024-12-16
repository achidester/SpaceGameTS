import * as THREE from 'three';
import { Projectile } from './projectile';
import GameState from '../gameState';
import { EnemyManager } from '../managers';

export class Player {
  private readonly gameState = GameState.getInstance();
  private enemyManager: EnemyManager

  mesh: THREE.Object3D | null = null; // Mesh starts as null until player model is loaded. 
  fireRate: number;
  lastShotTime: number = 0;
  enemyTarget: THREE.Vector3 | null = null;
  maxHealth: number;
  health: number;
  healthBar: HTMLElement;
  private shootingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private playerModel: THREE.Object3D) {
    this.enemyManager = this.gameState.enemyManager;
    this.mesh = this.playerModel
    this.fireRate = 320;
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.healthBar = document.getElementById('playerHealthBar')!;
    this.enemyTarget = new THREE.Vector3(
      this.mesh.position.x,
      this.mesh.position.y,
      this.mesh.position.z - 5
    );
  }

  private showDeathScreen() {
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

  public takeDamage(damage: number) {
    this.health -= damage;
    this.health = Math.max(0, this.health); // Ensure health doesn't go below 0
    if (this.health <= 0) {
      console.log("Player has died!");
      this.showDeathScreen();
    }
  }

  private canShoot(): boolean {
    const currentTime = performance.now();
    return currentTime - this.lastShotTime >= this.fireRate;
  }

  public shoot(): void {
    if (!this.canShoot()) return; 
    this.lastShotTime = performance.now();
    const targetPosition = this.getTargetFromReticle();
    if (!targetPosition){ 
      return;
    }

    const projectile = this.createProjectile(targetPosition);
    this.addProjectileToScene(projectile);

    // DEV RAYCASTER LINE
    // const raycastLine = new THREE.ArrowHelper(projectile.raycaster.ray.direction, projectile.raycaster.ray.origin, 300, 0xff0000, .3, 5)
    // this.gameState.scene.add(raycastLine);

    this.trackProjectile(projectile);
  }


  private getTargetFromReticle(): THREE.Vector3 | null {
  
    // Ensure the reticle exists
    if (!this.gameState.reticle || !this.gameState.reticle.position) {
      console.warn("Reticle or its position not found in GameState.");
      return null;
    }
  
    // Directly return the reticle's position
    const targetPosition = this.gameState.reticle.position;
    console.log("Reticle Position:", targetPosition);
    return targetPosition;

    return this.gameState.reticle?.getWorldPosition(new THREE.Vector3()) || null;
  }

  private createProjectile(targetPosition: THREE.Vector3): Projectile {
    const direction = this.calculateDirectionToTarget(targetPosition);
    
    return new Projectile(
      this.mesh!.position.clone(),
      direction, 
      undefined, // maxRange
      undefined, // pierceCount
      this.enemyManager.handleEnemyHit.bind(this.enemyManager) // Callback to handle hits
    );
    
  }

  private calculateDirectionToTarget(targetPosition: THREE.Vector3): THREE.Vector3 {
    const direction = new THREE.Vector3();
    direction.subVectors(targetPosition, this.mesh!.position).normalize();
    return direction;
  }

  private addProjectileToScene(projectile: Projectile): void {
    this.gameState.scene.add(projectile.mesh);
  }

  private trackProjectile(projectile: Projectile): void {
    this.gameState.projectiles.push(projectile);
  }


  get position(): THREE.Vector3 | null {
    return this.mesh?.position || null;
  }
  
  public startShooting(): void {
    if (!this.shootingInterval) {
      this.shootingInterval = setInterval(() => {
        this.shoot();
      }, this.fireRate / 3); // Call more frequently, but let `shoot()` handle timing
    }
  }

  public stopShooting(): void {
    if (this.shootingInterval) {
      clearInterval(this.shootingInterval);
      this.shootingInterval = null;
    }
  }

  public updateEnemyTarget() {
    if (this.mesh && this.enemyTarget) {
      this.enemyTarget.set(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z - 5
      );
    }
  }

}