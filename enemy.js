import { ENEMY_CONFIG } from './enemyConfig.js';
import { GameMath } from './utils.js';

const BasicEnemy = 'basic';
const FastEnemy = 'fast';
const TankEnemy = 'tank';
const ShooterEnemy = 'shooter';
const ExploderEnemy = 'exploder';
const BossEnemy = 'boss';

class Enemy {
    constructor(x, y, type = BasicEnemy) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.lifetime = 0;

        this.targetX = x;
        this.targetY = y;

        this.isActive = false;

        this.setTypeProperties();
    }

    restart(x, y, type = BasicEnemy) {
        this.lifetime = 0;
        this.isActive = true;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.type = type;
        this.setTypeProperties();
    }

    stop() {
        this.isActive = false;
        this.lifetime = 0;
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.type = "dead";
    }

    setTypeProperties() {
        const config = ENEMY_CONFIG[this.type];
        if (!config) throw new Error(`Unknown enemy type: ${this.type}`);

        const difficulty = window.game ? window.game.difficultyMultiplier : 1.0;

        for (const key in config) {
            this[key] = config[key];
        }

        this.health = Math.floor(this.health * difficulty);
        this.damage = Math.floor(this.damage * difficulty);

        this.maxHealth = this.health;
    }

    update(deltaTime, player, bullets = null) {
        this.lifetime += deltaTime;

        let speedMultiplier = 1;
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime;
            speedMultiplier = this.slowAmount;
        }

        const effectiveSpeed = this.speed * speedMultiplier;

        switch (this.type) {
            case BasicEnemy:
            case FastEnemy:
            case TankEnemy:
                this.updateBasicMovement(deltaTime, player, effectiveSpeed);
                break;

            case ShooterEnemy:
                this.updateShooter(deltaTime, player, bullets, effectiveSpeed);
                break;

            case ExploderEnemy:
                this.updateExploder(deltaTime, player, effectiveSpeed);
                break;

            case BossEnemy:
                this.updateBoss(deltaTime, player, bullets, effectiveSpeed);
                break;
        }
    }

    updateBasicMovement(deltaTime, player, speed = this.speed) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = GameMath.getDistance(player.x, player.y, this.x, this.y);

        this.targetX = player.x;
        this.targetY = player.y;

        if (distance > 0) {
            this.x += (dx / distance) * speed * (deltaTime / 1000);
            this.y += (dy / distance) * speed * (deltaTime / 1000);
        }
    }

    updateShooter(deltaTime, player, bullets, speed = this.speed) {
        //stop when shooting 
        const distance = GameMath.getDistance(player.x, player.y, this.x, this.y);

        const dx = player.x - this.x;
        const dy = player.y - this.y;

        this.targetX = player.x;
        this.targetY = player.y;

        //move away when close
        if (distance > this.shootRange + 20) {
            this.x += (dx / distance) * speed * (deltaTime / 1000);
            this.y += (dy / distance) * speed * (deltaTime / 1000);
        } else if (distance < this.shootRange - 20) {
            this.x -= (dx / distance) * speed * 0.5 * (deltaTime / 1000);
            this.y -= (dy / distance) * speed * 0.5 * (deltaTime / 1000);
        }

        //shooting
        this.lastShot += deltaTime;
        if (this.lastShot >= this.shootCooldown && distance <= this.shootRange && bullets) {
            const angle = Math.atan2(dy, dx);
            bullets.push(new EnemyBullet(this.x, this.y, angle));
            this.lastShot = 0;
        }
    }

    updateExploder(deltaTime, player, speed = this.speed) {
        if (this.isExploding) {
            this.explosionTimer += deltaTime;
            if (this.explosionTimer >= this.explosionDuration) {
                this.health = 0;
            }
            return;
        }

        const distance = GameMath.getDistance(player.x, player.y, this.x, this.y);

        this.targetX = player.x;
        this.targetY = player.y;
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        if (distance > 0) {
            let currentSpeed = speed;
            if (distance < 100) {
                currentSpeed *= 1.5;
                this.color = Math.floor(this.lifetime / 100) % 2 ? '#ff44ff' : '#ffffff';
            }

            this.x += (dx / distance) * currentSpeed * (deltaTime / 1000);
            this.y += (dy / distance) * currentSpeed * (deltaTime / 1000);

            // boom
            if (distance < 30) {
                this.explode(player);
            }
        }
    }

    explode(player) {
        this.isExploding = true;
        this.explosionTimer = 0;

        if (player && typeof player.takeDamage === 'function') {
            const distance = GameMath.getDistance(player.x, player.y, this.x, this.y);

            if (distance <= this.explosionRadius) {
                player.takeDamage(this.damage * player.damageReduction);
            }
        }
    }

    updateBoss(deltaTime, player, bullets, speed = this.speed) {
        const distance = GameMath.getDistance(player.x, player.y, this.x, this.y);
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        this.targetX = player.x;
        this.targetY = player.y;

        if (distance > this.shootRange - 50) {
            this.x += (dx / distance) * speed * (deltaTime / 1000);
            this.y += (dy / distance) * speed * (deltaTime / 1000);
        }

        this.lastShot += deltaTime;
        if (this.lastShot >= this.shootCooldown && distance <= this.shootRange && bullets) {
            const baseAngle = Math.atan2(dy, dx);
            const spread = 0.2; // radians
            for (let i = -2; i <= 2; i++) {
                bullets.push(new EnemyBullet(this.x, this.y, baseAngle + i * spread));
            }
            this.lastShot = 0;
        }
    }

    takeDamage(damage) {
        this.health -= damage;

        if (window.game && window.game.damageNumbers) {
            window.game.damageNumbers.addDamageNumber(
                this.x + (Math.random() - 0.5) * 20,
                this.y - 10,
                damage,
                'normal'
            );
        }

        if (this.type === ExploderEnemy && this.health <= 0 && !this.isExploding) {
            this.health = 1;

            this.isExploding = true;
            this.explosionTimer = 0;
        }
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX > -50 && screenX < camera.width + 50 &&
            screenY > -50 && screenY < camera.height + 50) {

            if (this.type === ExploderEnemy && this.isExploding) {
                const explosionProgress = this.explosionTimer / this.explosionDuration;
                const explosionSize = this.explosionRadius * explosionProgress;

                ctx.fillStyle = `rgba(255, 255, 0, ${1 - explosionProgress})`;
                ctx.beginPath();
                ctx.arc(screenX, screenY, explosionSize, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = `rgba(255, 100, 0, ${1 - explosionProgress})`;
                ctx.beginPath();
                ctx.arc(screenX, screenY, explosionSize * 0.6, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = this.color;
            this.drawEnemyShape(ctx, screenX, screenY);

            this.drawHealthBar(ctx, screenX, screenY);
        }
    }

    applySlow(slowAmount, duration) {
        this.slowAmount = slowAmount;
        this.slowDuration = duration;
        this.slowTimer = duration;
    }

    drawEnemyShape(ctx, screenX, screenY) {
        ctx.save();

        switch (this.type) {
            case BasicEnemy: //circle
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
                ctx.fill();
                break;

            case FastEnemy: //triangle
                const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x) || 0;
                ctx.translate(screenX, screenY);
                ctx.rotate(angle);

                ctx.beginPath();
                ctx.moveTo(this.radius, 0);
                ctx.lineTo(-this.radius * 0.7, -this.radius * 0.7);
                ctx.lineTo(-this.radius * 0.7, this.radius * 0.7);
                ctx.closePath();
                ctx.fill();

                ctx.strokeStyle = '#ff6600';
                ctx.lineWidth = 2;
                ctx.stroke();

                break;

            case TankEnemy: //square
                const tankAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
                ctx.translate(screenX, screenY);
                ctx.rotate(tankAngle);

                const size = this.radius * 0.8;

                ctx.fillStyle = '#444444';
                ctx.fillRect(-size, -size, size * 2, size * 2);
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = 3;
                ctx.strokeRect(-size, -size, size * 2, size * 2);

                ctx.fillStyle = '#666666';
                const cabSize = size * 0.5;
                ctx.fillRect(-cabSize, -cabSize, cabSize * 2, cabSize * 2);

                ctx.fillStyle = '#884400';
                ctx.beginPath();
                ctx.moveTo(size, -size * 1.2);
                ctx.lineTo(size + size * 0.8, 0);
                ctx.lineTo(size, size * 1.2);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = '#552200';
                ctx.stroke();

                ctx.fillStyle = '#cccccc';
                for (let i = -2; i <= 2; i++) {
                    const spikeY = i * (size * 0.4);
                    ctx.beginPath();
                    ctx.moveTo(size + size * 0.8, spikeY - size * 0.1);
                    ctx.lineTo(size + size * 1.4, spikeY);
                    ctx.lineTo(size + size * 0.8, spikeY + size * 0.1);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.fillStyle = '#aa0000';
                ctx.fillRect(size * 0.3, -size * 0.15, size * 0.8, size * 0.3);

                ctx.resetTransform();

                break;

            case ShooterEnemy: //hexagon
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const hexAngle = (i * Math.PI) / 3;
                    const x = screenX + Math.cos(hexAngle) * this.radius;
                    const y = screenY + Math.sin(hexAngle) * this.radius;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();

                const gunAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x) || 0;
                ctx.strokeStyle = '#aa0044';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(
                    screenX + Math.cos(gunAngle) * (this.radius + 8),
                    screenY + Math.sin(gunAngle) * (this.radius + 8)
                );
                ctx.stroke();
                break;

            case ExploderEnemy: //star
                const pulseSize = this.radius + Math.sin(this.lifetime * 0.01) * 3;
                const spikes = 8;
                const outerRadius = pulseSize;
                const innerRadius = pulseSize * 0.5;

                ctx.beginPath();
                for (let i = 0; i < spikes * 2; i++) {
                    const starAngle = (i * Math.PI) / spikes;
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const x = screenX + Math.cos(starAngle) * radius;
                    const y = screenY + Math.sin(starAngle) * radius;
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
                ctx.fill();

                if (this.isExploding || this.color === '#ffffff') {
                    ctx.shadowColor = '#ff44ff';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
                break;
            case BossEnemy:
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#ff0000';
                ctx.stroke();
                ctx.font = 'bold 14px Arial';
                ctx.fillStyle = '#000';
                ctx.textAlign = 'center';
                ctx.fillText('BOSS', screenX, screenY + 4);
                break;
        }

        ctx.restore();
    }


    drawHealthBar(ctx, screenX, screenY) {
        const barWidth = Math.max(20, this.radius * 1.5);
        const barHeight = 3;
        const barX = screenX - barWidth / 2;
        const barY = screenY - this.radius - 12;

        //backgrond
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        //health
        ctx.fillStyle = '#00ff00';
        const healthPercent = this.health / this.maxHealth;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        //border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}

class EnemyBullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 150;
        this.radius = 4;
        this.damage = 15;
        this.lifetime = 0;
        this.maxLifetime = 4000;
    }

    update(deltaTime) {
        this.x += Math.cos(this.angle) * this.speed * (deltaTime / 1000);
        this.y += Math.sin(this.angle) * this.speed * (deltaTime / 1000);
        this.lifetime += deltaTime;
    }

    isExpired() {
        return this.lifetime > this.maxLifetime;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX > -10 && screenX < camera.width + 10 &&
            screenY > -10 && screenY < camera.height + 10) {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export { Enemy };