export class UI {
    private uiCanvas: HTMLCanvasElement;
    private uiContext: CanvasRenderingContext2D;
    private playerMaxHealth: number;
  
    constructor(playerMaxHealth: number) {
      this.uiCanvas = document.createElement('canvas');
      this.uiCanvas.style.position = 'absolute';
      this.uiCanvas.style.top = '0';
      this.uiCanvas.style.left = '0';
      this.uiCanvas.style.pointerEvents = 'none';
      document.body.appendChild(this.uiCanvas);
  
      this.uiContext = this.uiCanvas.getContext('2d')!;
      this.playerMaxHealth = playerMaxHealth;
  
      // Resize canvas to match the WebGL canvas
      window.addEventListener('resize', this.resizeCanvas.bind(this));
      this.resizeCanvas();
    }
  
    private resizeCanvas() {
      const gameCanvas = document.getElementById('canvas') as HTMLCanvasElement;
  
      if (gameCanvas) {
        this.uiCanvas.width = gameCanvas.offsetWidth;
        this.uiCanvas.height = gameCanvas.offsetHeight;
  
        // Optional: Match position to gameCanvas for dynamic placement
        const rect = gameCanvas.getBoundingClientRect();
        this.uiCanvas.style.width = `${rect.width}px`;
        this.uiCanvas.style.height = `${rect.height}px`;
        this.uiCanvas.style.left = `${rect.left}px`;
        this.uiCanvas.style.top = `${rect.top}px`;
      }
    }
  
    drawHealthBar(currentHealth: number) {
      const barWidth = 200; // Width of the health bar
      const barHeight = 20; // Height of the health bar
      const verticalPadding = 20; // Padding from the edges
      const horizontalPadding = 50; // Padding from the edges
  
      const x = this.uiCanvas.width - barWidth - horizontalPadding; // Position from the right
      const y = this.uiCanvas.height - barHeight - verticalPadding ; // Position from the bottom
  
      const healthPercentage = currentHealth / this.playerMaxHealth;
  
      // Clear the UI canvas
      this.uiContext.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
  
      // Draw the background bar
      this.uiContext.fillStyle = 'gray';
      this.uiContext.fillRect(x, y, barWidth, barHeight);
  
      // Draw the health bar
      this.uiContext.fillStyle = 'green';
      this.uiContext.fillRect(x, y, barWidth * healthPercentage, barHeight);
  
      // Draw the health text
      this.uiContext.fillStyle = 'white';
      this.uiContext.font = '16px Arial';
      this.uiContext.textAlign = 'center';
      this.uiContext.textBaseline = 'middle';
      this.uiContext.fillText(
        `${currentHealth}/${this.playerMaxHealth}`,
        x + barWidth / 2,
        y + barHeight / 2
      );
    }

    
  }