export class UI {
  private uiCanvas: HTMLCanvasElement;
  private uiContext: CanvasRenderingContext2D;
  private playerMaxHealth: number;

  constructor(playerMaxHealth: number) {
    this.uiCanvas = document.createElement('canvas');
    this.uiCanvas.style.position = 'absolute';
    this.uiCanvas.style.margin = '25px';
    this.uiCanvas.style.paddingTop = '20px';
    this.uiCanvas.style.bottom = '0';
    this.uiCanvas.style.right = '0';
    this.uiCanvas.style.pointerEvents = 'none';
    this.uiCanvas.style.backgroundColor = 'rgba(140, 0, 0, 0.2)';
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
    const y = this.uiCanvas.height - barHeight - verticalPadding; // Position from the bottom
    const healthPercentage = currentHealth / this.playerMaxHealth;

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

  drawPlayTime(playTime: number) {
    const barWidth = 200; // Match health bar width
    const barHeight = 20; // Match health bar height
    const verticalPadding = 20; // Padding from the edges
    const horizontalPadding = 50; // Padding from the edges

    // Ensure playTime is in milliseconds
    const totalSeconds = Math.floor(playTime / 1000); // Convert from milliseconds to seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format the time as HH:MM:SS
    const timerText = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Position the timer slightly above the health bar
    const x = this.uiCanvas.width - barWidth / 2 - horizontalPadding;
    const y = this.uiCanvas.height - barHeight - verticalPadding * 2; // Offset above the health bar
    // Draw the timer text
    this.uiContext.fillStyle = 'white';
    this.uiContext.font = '48px DigitalClock';  
    this.uiContext.textAlign = 'center';
    this.uiContext.textBaseline = 'bottom'; // Align text above the health bar
    this.uiContext.fillText(timerText, x, y);
  }

  drawScore(score: number) {
    const barWidth = 200; // Match other UI elements' width
    const barHeight = 20; // Match other UI elements' height
    const verticalPadding = 30; // Padding from the edges
    const horizontalPadding = 50; // Padding from the edges
  
    // Position the score above the play time
    const x = this.uiCanvas.width - barWidth / 2 - horizontalPadding;
    const y = this.uiCanvas.height - barHeight - verticalPadding * 3; // Offset above the play time
  
    // Draw the score text
    this.uiContext.fillStyle = 'yellow';
    this.uiContext.font = '48px DigitalClock';
    this.uiContext.textAlign = 'center';
    this.uiContext.textBaseline = 'bottom';
    this.uiContext.fillText(`xp: ${score}`, x, y);
  }
  

  private clearCanvas() {
    this.uiContext.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
  }

  drawUI(currentHealth: number, playTime: number, score: number) {
    this.clearCanvas(); // Clear once at the beginning
    this.drawHealthBar(currentHealth);
    this.drawPlayTime(playTime);
    this.drawScore(score); // Add score to the UI
  }
} 