class FPSMeter {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = 0;
        this.updateInterval = 500;
        this.lastUpdateTime = 0;
        this.frameTimes = [];
        this.maxFrameTimes = 60; 
    }
    
    update(currentTime) {
        const frameTime = currentTime - this.lastTime;
        this.frameTimes.push(frameTime);
        
        if (this.frameTimes.length > this.maxFrameTimes) {
            this.frameTimes.shift();
        }
        
        this.frameCount++;
        this.lastTime = currentTime;
        
        if (currentTime - this.lastUpdateTime >= this.updateInterval) {
            const deltaTime = currentTime - this.lastUpdateTime;
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameCount = 0;
            this.lastUpdateTime = currentTime;
        }
    }
    
    getAverageFrameTime() {
        if (this.frameTimes.length === 0) return 0;
        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
        return Math.round(sum / this.frameTimes.length * 100) / 100;
    }
    
    render(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        
        const x = ctx.canvas.width - 10;
        ctx.fillText(`FPS: ${this.fps}`, x, 20);
        ctx.fillText(`Frame: ${this.getAverageFrameTime()}ms`, x, 40);
        
        ctx.restore();
    }
}

export { FPSMeter };