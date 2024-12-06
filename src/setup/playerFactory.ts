import { Player } from "../components";
import { ResourceManager } from "../managers";


export class PlayerFactory {
    constructor(private resourceManager: ResourceManager) {}
  
    async createPlayer(): Promise<Player> {
      const playerModel = await this.resourceManager.loadModel('../models/LOWPOLYSPACESHIP_v1.glb');
      console.log(playerModel);
      playerModel.scale.set(0.25, 0.25, 0.25);
      playerModel.position.set(0, 0, 5);
      return new Player(playerModel);
    }
  }