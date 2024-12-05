export class OverlayManager {
    private paused: boolean = false;
    private gameInitialized: boolean = false;
  
    private pauseOverlay: HTMLElement | null;
    private loadingOverlay: HTMLElement | null;
  
    constructor() {
      this.pauseOverlay = document.getElementById("pauseOverlay");
      this.loadingOverlay = document.getElementById("loadingOverlay");
  
      // Overlay visability
      if (this.pauseOverlay) this.pauseOverlay.style.display = "none";
      if (this.loadingOverlay) this.loadingOverlay.style.display = "flex";
    }
  
    isPaused(): boolean {
      return this.paused;
    }
    isGameInitialized(): boolean {
      return this.gameInitialized;
    }
  
    showPauseOverlay() {
      if (this.pauseOverlay) this.pauseOverlay.style.display = "flex";
    }
    hidePauseOverlay() {
      if (this.pauseOverlay) this.pauseOverlay.style.display = "none";
    }
  
    showLoadingOverlay() {
      if (this.loadingOverlay) this.loadingOverlay.style.display = "flex";
    }
    hideLoadingOverlay() {
      if (this.loadingOverlay) this.loadingOverlay.style.display = "none";
    }
  
    togglePause() {
      this.paused = !this.paused;
      if (this.paused) {
        this.showPauseOverlay();
        document.exitPointerLock();
      } else {
        this.hidePauseOverlay();
      }
    }
    
    setGameInitialized(value: boolean) {
      this.gameInitialized = value;
      if (value) {
        this.hideLoadingOverlay();
      } else {
        this.showLoadingOverlay();
      }
    }

    showError(message: string) {
      if (this.loadingOverlay) {
        this.loadingOverlay.innerHTML = `<p style="color: red;">${message}</p>`;
      }
    }
  }
  