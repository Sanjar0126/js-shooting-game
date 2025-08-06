class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 200;
        this.health = 100;
        this.maxHealth = 100;
        this.lastShot = 0;
        this.shootCooldown = 200;
        this.isDead = false;
        this.deathTimer = 0;
        this.autoShootRange = 800;
    }

    update(deltaTime, keys, mouseWorldPos, enemies, bullets, camera) {
        if (this.isDead) {
            this.deathTimer += deltaTime;
            return;
        }

        if (mouseWorldPos) {
            const dx = mouseWorldPos.x - this.x;
            const dy = mouseWorldPos.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 10) {
                const moveX = (dx / distance) * this.speed * (deltaTime / 1000);
                const moveY = (dy / distance) * this.speed * (deltaTime / 1000);

                this.x += moveX;
                this.y += moveY;
            }
        }

        this.lastShot += deltaTime;

        this.autoShoot(enemies, bullets, camera, deltaTime);
    }

    autoShoot(enemies, bullets, camera, deltaTime) {
        if (this.isDead || this.lastShot < this.shootCooldown) return;

        let nearestEnemy = null;
        let nearestDistance = this.autoShootRange;

        enemies.forEach(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        });

        if (nearestEnemy) {
            const angle = Math.atan2(nearestEnemy.y - this.y, nearestEnemy.x - this.x);
            bullets.push(new Bullet(this.x, this.y, angle));
            this.lastShot = 0;
        }
    }

    shoot(targetX, targetY, bullets, camera, isWorldCoords = false) {
        if (this.isDead || this.lastShot < this.shootCooldown) return;

        if (this.lastShot < this.shootCooldown) return;

        let worldTargetX, worldTargetY

        if (isWorldCoords) {
            worldTargetX = targetX;
            worldTargetY = targetY;
        } else {
            worldTargetX = targetX + camera.x;
            worldTargetY = targetY + camera.y;
        }

        const dx = worldTargetX - this.x;
        const dy = worldTargetY - this.y;
        const angle = Math.atan2(dy, dx);

        bullets.push(new Bullet(this.x, this.y, angle));
        this.lastShot = 0;
    }

    takeDamage(damage) {
        if (this.isDead) return;

        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.deathTimer = 0;
        }
    }

    render(ctx, camera) {
        if (this.isDead) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // ctx.strokeStyle = 'rgba(255, 255, 0, 0.2)';
        // ctx.beginPath();
        // ctx.arc(screenX, screenY, this.autoShootRange, 0, Math.PI * 2);
        // ctx.stroke();

        const barWidth = 30;
        const barHeight = 4;
        const barX = screenX - barWidth / 2;
        const barY = screenY - this.radius - 10;

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        ctx.fillStyle = '#00ff00';
        const healthPercent = this.health / this.maxHealth;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }
}

class Bullet {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 400;
        this.radius = 3;
        this.damage = 25;
        this.lifetime = 0;
        this.maxLifetime = 3000;
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
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export { Player };