class Player {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;

        this.baseSpeed = 200;
        this.baseHealth = 100;
        this.baseShootCooldown = 500;
        this.baseDamage = 25;
        this.baseBulletSpeed = 400;
        this.baseAutoShootRange = 800;

        this.speed = this.baseSpeed;
        this.health = this.baseHealth;
        this.maxHealth = this.baseHealth;
        this.shootCooldown = this.baseShootCooldown;
        this.autoShootRange = this.baseAutoShootRange;

        this.speedMultiplier = 1.0;
        this.damageMultiplier = 1.0;
        this.shootCooldownMultiplier = 1.0;
        this.bulletSpeedMultiplier = 1.0;
        this.damageReduction = 1.0;

        this.skills = {
            magicMissile: {
                level: 1,
                cooldown: 0,
                damage: 20,
                speed: 400
            }
        };

        this.lastShot = 0;
        this.isDead = false;
        this.deathTimer = 0;
        this.regenTimer = 0;
        this.healthRegen = 0;

        this.isShielded = false;
        this.shieldTimer = 0;

        this.radius = 15;
    }

    update(deltaTime, keys, mouseWorldPos, enemies, bullets, camera) {
        if (this.isDead) {
            this.deathTimer += deltaTime;
            return;
        }

        this.updateSkillCooldowns(deltaTime);

        if (this.isShielded) {
            this.shieldTimer -= deltaTime;
            if (this.shieldTimer <= 0) {
                this.isShielded = false;
            }
        }

        if (this.healthRegen > 0) {
            this.regenTimer += deltaTime;
            if (this.regenTimer >= 1000) {
                this.heal(this.healthRegen);
                this.regenTimer = 0;
            }
        }

        const currentSpeed = this.baseSpeed * this.speedMultiplier;

        if (mouseWorldPos) {
            const dx = mouseWorldPos.x - this.x;
            const dy = mouseWorldPos.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 10) {
                const moveX = (dx / distance) * currentSpeed * (deltaTime / 1000);
                const moveY = (dy / distance) * currentSpeed * (deltaTime / 1000);

                this.x += moveX;
                this.y += moveY;
            }
        }

        // this.lastShot += deltaTime;
        // this.autoShoot(enemies, bullets, camera, deltaTime);
    }

    updateSkillCooldowns(deltaTime) {
        Object.keys(this.skills).forEach(skillName => {
            if (this.skills[skillName].cooldown > 0) {
                this.skills[skillName].cooldown -= deltaTime;
            }
        });
    }

    useSkill(skillName, targets, enemies, skillProjectiles, explosions) {
        const skill = this.skills[skillName];
        if (!skill || skill.cooldown > 0) return false;

        switch (skillName) {
            case 'magicMissile':
                skillProjectiles.push(new window.MagicMissile(
                    this.x, this.y, targets[0].x, targets[0].y,
                    skill.damage * this.damageMultiplier, skill.speed * this.bulletSpeedMultiplier
                ));
                skill.cooldown = (window.SKILL_CONFIG[skillName].baseCooldown - (skill.level - 1) * 40) * this.shootCooldownMultiplier;
                break;
            case 'fireball':
                const fireball = new window.Fireball(
                    this.x, this.y, targets[0].x, targets[0].y,
                    skill.damage * this.damageMultiplier, skill.radius
                );
                skillProjectiles.push(fireball);
                skill.cooldown = (window.SKILL_CONFIG[skillName].baseCooldown - (skill.level - 1) * 200) * this.shootCooldownMultiplier;
                break;
            case 'chainLightning':
                skillProjectiles.push(new window.ChainLightning(
                    this.x, this.y, enemies,
                    skill.damage * this.damageMultiplier, skill.chains, skill.range
                ));
                skill.cooldown = (window.SKILL_CONFIG[skillName].baseCooldown - (skill.level - 1) * 300) * this.shootCooldownMultiplier;
                break;

            case 'iceSpike':
                skillProjectiles.push(new window.IceSpike(
                    this.x, this.y, targets[0].x, targets[0].y,
                    skill.damage * this.damageMultiplier, skill.slowDuration, skill.slowAmount
                ));
                skill.cooldown = (window.SKILL_CONFIG[skillName].baseCooldown - (skill.level - 1) * 200) * this.shootCooldownMultiplier;
                break;

            case 'meteor':
                for (let i = 0; i < skill.count; i++) {
                    const offsetX = (Math.random() - 0.5) * 60;
                    const offsetY = (Math.random() - 0.5) * 60;
                    const meteor = new window.Meteor(
                        targets[i % targets.length].x + offsetX,
                        targets[i % targets.length].y + offsetY,
                        skill.damage * this.damageMultiplier,
                        skill.radius,
                        300,
                    );

                    meteor.warningTimer += i * 100;

                    skillProjectiles.push(meteor);
                }
                skill.cooldown = (window.SKILL_CONFIG[skillName].baseCooldown - (skill.level - 1) * 500) * this.shootCooldownMultiplier;
                break;
            case 'shield':
                this.isShielded = true;
                this.shieldTimer = skill.duration;
                skill.cooldown = 8000 - (skill.level - 1) * 1000;
                break;
        }

        return true;
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

    heal(amount) {
        const actualHeal = Math.min(amount, this.maxHealth - this.health);
        this.health += actualHeal;

        if (window.game && window.game.damageNumbers && actualHeal > 0) {
            window.game.damageNumbers.addDamageNumber(
                this.x,
                this.y - 20,
                actualHeal,
                'heal'
            );
        }
    }

    takeDamage(damage) {
        if (this.isDead) return;

        if (window.game && window.game.damageNumbers) {
            window.game.damageNumbers.addDamageNumber(
                this.x + (Math.random() - 0.5) * 20,
                this.y - 15,
                damage,
                'critical'
            );
        }

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

        if (this.isShielded) {
            ctx.save();
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.radius + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

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