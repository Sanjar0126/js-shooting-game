class Enemy {
    constructor(x, y, type = 'basic') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.lifetime = 0;

        this.setTypeProperties();
    }

    setTypeProperties() {
        switch (this.type) {
            case 'basic':
                this.radius = 12;
                this.speed = 50;
                this.health = 50;
                this.maxHealth = 50;
                this.damage = 20;
                this.color = '#ff4444';
                this.scoreValue = 10;
                break;

            case 'fast':
                this.radius = 8;
                this.speed = 120;
                this.health = 25;
                this.maxHealth = 25;
                this.damage = 15;
                this.color = '#ff8844';
                this.scoreValue = 15;
                break;

            case 'tank':
                this.radius = 18;
                this.speed = 25;
                this.health = 150;
                this.maxHealth = 150;
                this.damage = 35;
                this.color = '#884444';
                this.scoreValue = 25;
                break;

            case 'shooter':
                this.radius = 10;
                this.speed = 30;
                this.health = 40;
                this.maxHealth = 40;
                this.damage = 15;
                this.color = '#ff4488';
                this.scoreValue = 20;
                this.lastShot = 0;
                this.shootCooldown = 2000;
                this.shootRange = 200;
                break;

            case 'exploder':
                this.radius = 14;
                this.speed = 80;
                this.health = 30;
                this.maxHealth = 30;
                this.damage = 50;
                this.color = '#ff44ff';
                this.scoreValue = 30;
                this.explosionRadius = 60;
                this.isExploding = false;
                this.explosionTimer = 0;
                this.explosionDuration = 500;
                break;
        }
    }

    update(deltaTime, player, bullets = null) {
        this.lifetime += deltaTime;

        switch (this.type) {
            case 'basic':
            case 'fast':
            case 'tank':
                this.updateBasicMovement(deltaTime, player);
                break;

            case 'shooter':
                this.updateShooter(deltaTime, player, bullets);
                break;

            case 'exploder':
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

        if (this.type === 'exploder' && this.health <= 0 && !this.isExploding) {
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
            if (this.type === 'exploder' && this.isExploding) {
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
                case 'fast': typeChar = 'F'; break;
                case 'tank': typeChar = 'T'; break;
                case 'shooter': typeChar = 'S'; break;
                case 'exploder': typeChar = 'E'; break;
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