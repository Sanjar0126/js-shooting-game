export class DamageNumber {
    constructor(x, y, damage, type = 'normal') {
        this.x = x;
        this.y = y;
        this.damage = Math.floor(damage);
        this.type = type;


        this.vx = (Math.random() - 0.5) * 50;
        this.vy = -80;
        this.gravity = 20;


        this.lifetime = 0;
        this.maxLifetime = 1500;
        this.fontSize = this.getFontSize();
        this.color = this.getColor();


        this.scale = 1.2;
        this.targetScale = 1.0;
    }

    getFontSize() {
        if (this.damage >= 100) return 18;
        if (this.damage >= 50) return 16;
        if (this.damage >= 25) return 14;
        return 12;
    }

    getColor() {
        switch (this.type) {
            case 'critical': return '#ff0000';
            case 'skill': return '#ff8800';
            case 'explosion': return '#ffaa00';
            case 'heal': return '#00ff00';
            default: return '#ffffff';
        }
    }

    update(deltaTime) {
        this.lifetime += deltaTime;

        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.vy += this.gravity * (deltaTime / 1000);

        const progress = this.lifetime / 300;
        if (progress < 1) {
            this.scale = this.scale + (this.targetScale - this.scale) * progress;
        }

        return this.lifetime >= this.maxLifetime;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        const progress = this.lifetime / this.maxLifetime;
        let alpha = 1.0;

        if (progress > 0.7) {
            alpha = 1.0 - ((progress - 0.7) / 0.3);
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${this.fontSize * this.scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = '#000000';
        ctx.fillText(this.damage.toString(), screenX + 1, screenY + 1);

        ctx.fillStyle = this.color;
        ctx.fillText(this.damage.toString(), screenX, screenY);

        ctx.restore();
    }
}

export class DamageNumberSystem {
    constructor() {
        this.damageNumbers = [];
    }

    addDamageNumber(x, y, damage, type = 'normal') {
        this.damageNumbers.push(new DamageNumber(x, y, damage, type));
    }

    update(deltaTime) {
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            if (this.damageNumbers[i].update(deltaTime)) {
                this.damageNumbers.splice(i, 1);
            }
        }
    }

    render(ctx, camera) {
        this.damageNumbers.forEach(damageNumber => {
            damageNumber.render(ctx, camera);
        });
    }

    clear() {
        this.damageNumbers = [];
    }
}