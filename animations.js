class DeathAnimation {
    constructor(x, y, type = 'enemy') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.timer = 0;
        this.duration = type === 'player' ? 2000 : 800; 
        this.particles = [];
        
        const particleCount = type === 'player' ? 15 : 8;
        const colors = type === 'player' ? ['#4CAF50', '#45a049', '#ffffff'] : ['#ff4444', '#ff6666', '#ffaaaa'];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 200, 
                vy: (Math.random() - 0.5) * 200,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0
            });
        }
    }
    
    update(deltaTime) {
        this.timer += deltaTime;
        const progress = this.timer / this.duration;
        
        this.particles.forEach(particle => {
            particle.x += particle.vx * (deltaTime / 1000);
            particle.y += particle.vy * (deltaTime / 1000);
            particle.vy += 100 * (deltaTime / 1000); 
            particle.vx *= 0.98; 
            particle.life = Math.max(0, 1 - progress);
            particle.size *= 0.995;
        });
        
        return this.timer >= this.duration;
    }
    
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        if (screenX > -100 && screenX < camera.width + 100 && 
            screenY > -100 && screenY < camera.height + 100) {
            
            this.particles.forEach(particle => {
                const particleScreenX = particle.x - camera.x;
                const particleScreenY = particle.y - camera.y;
                
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particleScreenX, particleScreenY, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            
            if (this.type === 'player' && this.timer < this.duration * 0.7) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - (this.timer / (this.duration * 0.7)));
                ctx.fillStyle = '#ff0000';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('WASTED', screenX, screenY - 30);
                ctx.restore();
            }
        }
    }
}

class LevelUpEffect {
    constructor(x, y, playerLevel) {
        this.x = x;
        this.y = y;

        this.playerLevel = playerLevel;

        this.timer = 0;
        this.duration = 2000; // 2 seconds
        this.particles = [];
        
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 150,
                vy: (Math.random() - 0.5) * 150 - 50, 
                size: Math.random() * 4 + 2,
                color: ['#FFD700', '#FFA500', '#FFFF00'][Math.floor(Math.random() * 3)],
                life: 1.0
            });
        }
    }
    
    update(deltaTime) {
        this.timer += deltaTime;
        const progress = this.timer / this.duration;
        
        this.particles.forEach(particle => {
            particle.x += particle.vx * (deltaTime / 1000);
            particle.y += particle.vy * (deltaTime / 1000);
            particle.vy += 30 * (deltaTime / 1000);
            particle.life = Math.max(0, 1 - progress);
            particle.size *= 0.998;
        });
        
        return this.timer >= this.duration;
    }
    
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        this.particles.forEach(particle => {
            const particleScreenX = particle.x - camera.x;
            const particleScreenY = particle.y - camera.y;
            
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particleScreenX, particleScreenY, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        if (this.timer < this.duration * 0.6) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - (this.timer / (this.duration * 0.6)));
            ctx.fillStyle = '#FFD700';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center';
            
            const textY = screenY - 40 - (this.timer / this.duration) * 20;
            ctx.strokeText('LEVEL UP!', screenX, textY);
            ctx.fillText('LEVEL UP!', screenX, textY);
            
            ctx.font = '14px Arial';
            ctx.strokeText(`Level ${this.playerLevel}`, screenX, textY + 25);
            ctx.fillText(`Level ${this.playerLevel}`, screenX, textY + 25);
            ctx.restore();
        }
    }
}

export { DeathAnimation, LevelUpEffect };