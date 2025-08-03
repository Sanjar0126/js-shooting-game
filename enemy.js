import { ENEMY_CONFIG } from './enemyConfig.js';

const BasicEnemy = 'basic';
const FastEnemy = 'fast';
const TankEnemy = 'tank';
const ShooterEnemy = 'shooter';
const ExploderEnemy = 'exploder';

class Enemy {
    constructor(x, y, type = BasicEnemy) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.lifetime = 0;

        this.setTypeProperties();
    }

    setTypeProperties() {
        const config = ENEMY_CONFIG[this.type];
        if (!config) throw new Error(`Unknown enemy type: ${this.type}`);

        for (const key in config) {
            this[key] = config[key];
        }

        this.maxHealth = this.health;
    }

    update(deltaTime, player, bullets = null) {
        this.lifetime += deltaTime;

        switch (this.type) {
            case BasicEnemy:
            case FastEnemy:
            case TankEnemy:
                this.updateBasicMovement(deltaTime, player);
                break;

            case ShooterEnemy:
                this.updateShooter(deltaTime, player, bullets);
                break;

            case ExploderEnemy:
                this.updateExploder(deltaTime, player);
                break;
        }
    }

    updateBasicMovement(deltaTime, player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed * (deltaTime / 1000);
            this.y += (dy / distance) * this.speed * (deltaTime / 1000);
        }
    }

    updateShooter(deltaTime, player, bullets) {
        //stop at shooting range
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        //move away when close
        if (distance > this.shootRange + 20) {
            this.x += (dx / distance) * this.speed * (deltaTime / 1000);
            this.y += (dy / distance) * this.speed * (deltaTime / 1000);
        } else if (distance < this.shootRange - 20) {
            this.x -= (dx / distance) * this.speed * 0.5 * (deltaTime / 1000);
            this.y -= (dy / distance) * this.speed * 0.5 * (deltaTime / 1000);
        }

        //shooting
        this.lastShot += deltaTime;
        if (this.lastShot >= this.shootCooldown && distance <= this.shootRange && bullets) {
            const angle = Math.atan2(dy, dx);
            bullets.push(new EnemyBullet(this.x, this.y, angle));
            this.lastShot = 0;
        }
    }

    updateExploder(deltaTime, player) {
        if (this.isExploding) {
            this.explosionTimer += deltaTime;
            if (this.explosionTimer >= this.explosionDuration) {
                this.health = 0;
            }
            return;
        }

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            let currentSpeed = this.speed;
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
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.explosionRadius) {
                player.takeDamage(this.damage);
            }
        }
    }

    takeDamage(damage) {
        this.health -= damage;

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

            //explosion effect
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

            //enemy body
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();

            //enemy type
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            let typeChar = '';
            switch (this.type) {
                case FastEnemy: typeChar = 'F'; break;
                case TankEnemy: typeChar = 'T'; break;
                case ShooterEnemy: typeChar = 'S'; break;
                case ExploderEnemy: typeChar = 'E'; break;
            }
            if (typeChar) {
                ctx.fillText(typeChar, screenX, screenY + 3);
            }

            //health bar
            const barWidth = Math.max(20, this.radius * 1.5);
            const barHeight = 3;
            const barX = screenX - barWidth / 2;
            const barY = screenY - this.radius - 8;

            ctx.fillStyle = '#ff0000';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            ctx.fillStyle = '#00ff00';
            const healthPercent = this.health / this.maxHealth;
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
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