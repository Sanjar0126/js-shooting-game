export const SKILL_CONFIG = {
    damageBoost: {
        name: 'Damage Boost',
        description: 'Increases the damage dealt by the player.',
        icon: '💪',
        type: 'passive',
        maxLevel: 5,
        effect: (player, level) => {
            player.damageMultiplier += 0.25;
        },
    },
    fireRate: {
        name: 'Reduce cooldown',
        description: 'Reduce cooldown.',
        icon: '⏱️',
        type: 'passive',
        maxLevel: 5,
        effect: (player, level) => {
            player.shootCooldownMultiplier -= 0.9;
        },
    },
    health: {
        name: 'Health',
        description: 'Increases the player\'s maximum health.',
        icon: '❤️',
        type: 'passive',
        maxLevel: 5,
        effect: (player, level) => {
            player.maxHealth += 20;
            player.health = Math.min(player.health + 20, player.maxHealth);
        },
    },
    regen: {
        name: 'Health Regeneration',
        description: 'Regenerates health over time.',
        icon: '💚',
        type: 'passive',
        maxLevel: 4,
        effect: (player, level) => {
            player.healthRegen += 0.5;
            player.regenTimer = 1000;
        },
    },
    damageReduction: {
        name: 'Damage Reduction',
        description: 'Reduces incoming damage.',
        icon: '🛡️',
        type: 'passive',
        maxLevel: 5,
        effect: (player, level) => {
            player.damageReduction -= 0.9;
        },
    },
    speed: {
        name: 'Agility',
        description: 'Increases the player\'s movement speed.',
        icon: '👟',
        type: 'passive',
        maxLevel: 4,
        effect: (player, level) => {
            player.speedMultiplier += 0.2;
        },
    },

    magicMissile: {
        name: 'Magic Missile',
        description: 'Fires a magic missile that deals damage to enemies.',
        icon: '✨',
        type: 'active',
        maxLevel: 5,
        baseCooldown: 500,
        baseDamage: 20,
        aimNearestEnemy: true,
        baseRange: 800,
        effect: (player, level) => {
            if (!player.skills.magicMissile) {
                player.skills.magicMissile = {
                    level: 0,
                    cooldown: 0,
                    damage: 20,
                    speed: 400
                };
            }
            player.skills.magicMissile.level = level;
            player.skills.magicMissile.damage = 20 + (level - 1) * 5;
        },
    },
    fireball: {
        name: 'Fireball',
        description: 'Launches explosive fireball.',
        icon: '🔥',
        type: 'active',
        maxLevel: 5,
        baseCooldown: 3000,
        baseDamege: 80,
        baseRadius: 60,
        aimNearestEnemy: true,
        effect: (player, level) => {
            if (!player.skills.fireball) {
                player.skills.fireball = {
                    level: 0,
                    cooldown: 0,
                    damage: 80,
                    radius: 60,
                    speed: 250
                };
            }
            player.skills.fireball.level = level;
            player.skills.fireball.damage = 80 + (level - 1) * 20;
            player.skills.fireball.radius = 60 + (level - 1) * 10;
        },
    },

    chainLightning: {
        name: 'Chain Lightning',
        description: 'Unleashes a chain lightning attack.',
        icon: '⚡️',
        type: 'active',
        maxLevel: 5,
        baseCooldown: 3000,
        baseDamage: 60,
        baseChains: 3,
        aimNearestEnemy: true,
        effect: (player, level) => {
            if (!player.skills.chainLightning) {
                player.skills.chainLightning = {
                    level: 0,
                    cooldown: 0,
                    damage: 60,
                    chains: 3,
                    range: 250,
                };
            }
            player.skills.chainLightning.level = level;
            player.skills.chainLightning.damage = 60 + (level - 1) * 15;
            player.skills.chainLightning.chains = 3 + (level - 1) * 2;
        },
    },

    iceSpike: {
        name: 'Ice Spike',
        description: 'Summons a spike of ice that damages and slows enemies.',
        icon: '❄️',
        type: 'active',
        maxLevel: 5,
        baseCooldown: 4000,
        baseDamage: 50,
        baseSlowDuration: 2000,
        baseSlowAmount: 0.5,
        aimNearestEnemy: true,
        effect: (player, level) => {
            if (!player.skills.iceSpike) {
                player.skills.iceSpike = {
                    level: 0,
                    cooldown: 0,
                    damage: 50,
                    slowDuration: 2000,
                    slowAmount: 0.5,
                    range: 300,
                };
            }
            player.skills.iceSpike.level = level;
            player.skills.iceSpike.damage = 50 + (level - 1) * 15;
            player.skills.iceSpike.slowDuration = 2000 + (level - 1) * 500;
        },
    },

    meteor: {
        name: 'Meteor Strike',
        description: 'Calls down a meteor that deals massive damage.',
        icon: '☄️',
        type: 'active',
        maxLevel: 5,
        baseCooldown: 8000,
        baseDamage: 100,
        baseRadius: 80,
        baseCount: 1,
        aimNearestEnemy: false,
        aimMultipleEnemies: true,
        effect: (player, level) => {
            if (!player.skills.meteor) {
                player.skills.meteor = {
                    level: 0,
                    cooldown: 0,
                    damage: 100,
                    radius: 80,
                    speed: 300,
                    count: 1,
                };
            }
            player.skills.meteor.level = level;
            player.skills.meteor.damage = 100 + (level - 1) * 25;
            player.skills.meteor.count = level;
        },
    },

    shield: {
        name: 'Shield',
        description: 'Grants a protective shield that absorbs damage.',
        icon: '🛡',
        type: 'active',
        maxLevel: 4,
        baseCooldown: 8000,
        baseDuration: 1000,
        effect: (player, level) => {
            if (!player.skills.shield) {
                player.skills.shield = {
                    level: 0,
                    cooldown: 0,
                    duration: 1000,
                    active: false,
                    timer: 0
                };
            }
            player.skills.shield.level = level;
            player.skills.shield.duration = 1000 + (level - 1) * 500;
        },
    }
}

export class SkillSystem {
    constructor() {
        this.playerSkills = {
            magicMissile: 1,
        };
    }

    generateSkillChoices(count = 3) {
        const availableSkills = Object.keys(SKILL_CONFIG).filter(skillId => {
            const currentLevel = this.playerSkills[skillId]?.level || 0;
            return currentLevel < SKILL_CONFIG[skillId].maxLevel;
        });

        if (availableSkills.length === 0) {
            return [];
        }

        const choices = [];
        const limit = Math.min(count, availableSkills.length)
        for (let i = 0; i < limit; i++) {
            const randomIndex = Math.floor(Math.random() * availableSkills.length);
            const skillId = availableSkills.splice(randomIndex, 1)[0];
            choices.push(skillId);
        }

        console.log('Generated skill choices:', choices);

        return choices;
    }

    selectSkill(skillId, player) {
        if (!SKILL_CONFIG[skillId]) {
            console.error(`Skill ${skillId} does not exist.`);
            return false;
        }

        const currentLevel = this.playerSkills[skillId] || 0;
        if (currentLevel >= SKILL_CONFIG[skillId].maxLevel) {
            console.warn(`Skill ${skillId} is already at max level.`);
            return false;
        }

        this.playerSkills[skillId] = currentLevel + 1;
        SKILL_CONFIG[skillId].effect(player, this.playerSkills[skillId]);

        return true;
    }

    getSkillLevel(skillId) {
        return this.playerSkills[skillId] || 0;
    }

    reset() {
        this.playerSkills = {
            magicMissile: 1,
        };
    }
}

export class Explosion {
    constructor(x, y, radius, damage, type = 'fire') {
        this.x = x;
        this.y = y;
        this.maxRadius = radius;
        this.damage = damage;
        this.type = type;
        this.currentRadius = 0;
        this.duration = 400;
        this.timer = 0;
    }

    update(deltaTime) {
        this.timer += deltaTime;
        const progress = this.timer / this.duration;
        this.currentRadius = this.maxRadius * Math.min(1, progress * 2);

        return this.timer > this.duration;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        const alpha = Math.max(0, 1 - (this.timer / this.duration));

        ctx.save();
        ctx.globalAlpha = alpha;

        if (this.type === 'fire') {
            ctx.fillStyle = '#ff4400';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.currentRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff8800';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.currentRadius * 0.7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.currentRadius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

export class MagicMissile {
    constructor(x, y, targetX, targetY, damage, speed) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.speed = speed;
        this.radius = 4;

        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        } else {
            this.vx = 0;
            this.vy = 0;
        }

        this.lifetime = 0;
        this.maxLifetime = 3000;

        this.trail = [];
        this.maxTrailLength = 8;

        this.isHit = false;
    }

    update(deltaTime, enemies) {
        if (this.isHit) return true;

        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.lifetime += deltaTime;

        this.trail.push({ x: this.x, y: this.y, time: this.lifetime });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        enemies.forEach(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + enemy.radius) {
                enemy.takeDamage(this.damage);

                this.isHit = true;

                return true;
            }
        });

        return this.lifetime > this.maxLifetime;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        this.trail.forEach((point, index) => {
            const trailScreenX = point.x - camera.x;
            const trailScreenY = point.y - camera.y;
            const alpha = (index / this.trail.length) * 0.5;
            const size = (index / this.trail.length) * this.radius;

            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#8844ff';
            ctx.beginPath();
            ctx.arc(trailScreenX, trailScreenY, size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.restore();

        ctx.save();

        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#aa66ff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#cc88ff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

export class Fireball {
    constructor(x, y, targetX, targetY, damage, radius) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.explosionRadius = radius;
        this.speed = 250;

        this.radius = 8;

        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;

        this.lifetime = 0;
        this.maxLifetime = 4000;
        this.exploded = false;
    }

    update(deltaTime, enemies, explosions) {
        if (this.exploded) return true;

        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.lifetime += deltaTime;

        for (let enemy of enemies) {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (this.radius + enemy.radius)) {
                this.explode(enemies, explosions);
                return true;
            }
        }

        return this.lifetime > this.maxLifetime
    }

    explode(enemies, explosions) {
        this.exploded = true;
        const explosion = new Explosion(this.x, this.y, this.explosionRadius, this.damage, 'fire');
        explosions.push(explosion);

        enemies.forEach(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.explosionRadius) {
                enemy.takeDamage(this.damage);
            }
        });
    }

    render(ctx, camera) {
        if (this.exploded) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(screenX - this.vx * 0.02, screenY - this.vy * 0.02, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff8800';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

export class ChainLightning {
    constructor(x, y, enemies, damage, chains, range) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.chains = chains;
        this.range = range;
        this.hitEnemies = new Set();
        this.lightningChain = [];
        this.duration = 500;
        this.timer = 0;

        this.createChain(enemies);
    }

    createChain(enemies) {
        let currentPos = { x: this.x, y: this.y };

        for (let i = 0; i < this.chains && enemies.length > 0; i++) {
            let nearestEnemy = null;
            let nearestDistance = this.range;

            enemies.forEach(enemy => {
                if (this.hitEnemies.has(enemy)) return;

                const dx = enemy.x - currentPos.x;
                const dy = enemy.y - currentPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            });

            if (nearestEnemy) {
                this.lightningChain.push({
                    from: { x: currentPos.x, y: currentPos.y },
                    to: { x: nearestEnemy.x, y: nearestEnemy.y }
                });

                nearestEnemy.takeDamage(this.damage);
                this.hitEnemies.add(nearestEnemy);
                currentPos = { x: nearestEnemy.x, y: nearestEnemy.y };
            } else {
                break;
            }
        }
    }

    update(deltaTime) {
        this.timer += deltaTime;
        return this.timer > this.duration;
    }

    render(ctx, camera) {
        const alpha = Math.max(0, 1 - (this.timer / this.duration));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;

        this.lightningChain.forEach(chain => {
            const fromX = chain.from.x - camera.x;
            const fromY = chain.from.y - camera.y;
            const toX = chain.to.x - camera.x;
            const toY = chain.to.y - camera.y;

            this.drawLightningBolt(ctx, fromX, fromY, toX, toY);

            if (Math.random() < 0.3) {
                this.drawLightningBranches(ctx, fromX, fromY, toX, toY);
            }
        });

        ctx.restore();
    }

    drawLightningBolt(ctx, fromX, fromY, toX, toY) {
        const segments = 8;
        const displacement = 15;

        let points = [{ x: fromX, y: fromY }];

        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const baseX = fromX + (toX - fromX) * t;
            const baseY = fromY + (toY - fromY) * t;

            const angle = Math.atan2(toY - fromY, toX - fromX) + Math.PI / 2;
            const disp = (Math.random() - 0.5) * displacement * (1 - Math.abs(t - 0.5) * 2);

            points.push({
                x: baseX + Math.cos(angle) * disp,
                y: baseY + Math.sin(angle) * disp
            });
        }

        points.push({ x: toX, y: toY });

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawLightningBranches(ctx, fromX, fromY, toX, toY) {
        const numBranches = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < numBranches; i++) {
            const t = 0.2 + Math.random() * 0.6;
            const branchStartX = fromX + (toX - fromX) * t;
            const branchStartY = fromY + (toY - fromY) * t;

            const branchLength = 20 + Math.random() * 30;
            const branchAngle = Math.atan2(toY - fromY, toX - fromX) +
                (Math.random() - 0.5) * Math.PI * 0.8;

            const branchEndX = branchStartX + Math.cos(branchAngle) * branchLength;
            const branchEndY = branchStartY + Math.sin(branchAngle) * branchLength;

            ctx.save();
            ctx.lineWidth = 2;
            ctx.globalAlpha *= 0.7;

            const branchSegments = 3;
            let branchPoints = [{ x: branchStartX, y: branchStartY }];

            for (let j = 1; j < branchSegments; j++) {
                const bt = j / branchSegments;
                const baseX = branchStartX + (branchEndX - branchStartX) * bt;
                const baseY = branchStartY + (branchEndY - branchStartY) * bt;

                const perpAngle = branchAngle + Math.PI / 2;
                const disp = (Math.random() - 0.5) * 8;

                branchPoints.push({
                    x: baseX + Math.cos(perpAngle) * disp,
                    y: baseY + Math.sin(perpAngle) * disp
                });
            }

            branchPoints.push({ x: branchEndX, y: branchEndY });

            ctx.beginPath();
            ctx.moveTo(branchPoints[0].x, branchPoints[0].y);
            for (let j = 1; j < branchPoints.length; j++) {
                ctx.lineTo(branchPoints[j].x, branchPoints[j].y);
            }
            ctx.stroke();

            ctx.restore();
        }
    }
}

export class IceSpike {
    constructor(x, y, targetX, targetY, damage, slowDuration, slowAmount) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.slowDuration = slowDuration;
        this.slowAmount = slowAmount;
        this.speed = 300;
        this.radius = 6;

        const dx = targetX - x;
        const dy = targetY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;

        this.lifetime = 0;
        this.maxLifetime = 3000;
        this.hitEnemies = new Set();
    }

    update(deltaTime, enemies) {
        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.lifetime += deltaTime;

        enemies.forEach(enemy => {
            if (this.hitEnemies.has(enemy)) return;

            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + enemy.radius) {
                enemy.takeDamage(this.damage);
                enemy.applySlow(this.slowAmount, this.slowDuration);
                this.hitEnemies.add(enemy);
            }
        });

        return this.lifetime > this.maxLifetime;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();

        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation || 0);

        const spikes = 6;
        const outerRadius = this.radius;
        const innerRadius = this.radius * 0.4;

        ctx.fillStyle = '#a0e0ff';
        ctx.strokeStyle = '#60c0e0';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#00aadd';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#e0f0ff';
        ctx.strokeStyle = '#80d0f0';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 4;

        const coreRadius = this.radius * 0.5;
        const coreInnerRadius = this.radius * 0.2;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? coreRadius : coreInnerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#b0d0e0';
        ctx.lineWidth = 0.8;
        ctx.shadowBlur = 1;

        for (let i = 0; i < spikes; i++) {
            const angle = (i * 2 * Math.PI) / spikes;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * outerRadius * 0.8, Math.sin(angle) * outerRadius * 0.8);
            ctx.stroke();
        }

        ctx.restore();
    }
}


export class Meteor {
    constructor(targetX, targetY, damage, radius, warningTime = 200) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.x = targetX + (Math.random() - 0.5) * 200;
        this.y = targetY - 400;
        this.damage = damage;
        this.explosionRadius = radius;
        this.speed = 400;
        this.radius = 12;
        this.warningTimer = warningTime;
        this.impacted = false;

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        this.vx = (dx / distance) * this.speed;
        this.vy = (dy / distance) * this.speed;
    }

    update(deltaTime, enemies, explosions) {
        if (this.warningTimer > 0) {
            this.warningTimer -= deltaTime;
            return false;
        }

        if (this.impacted) return true;

        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
            this.impact(enemies, explosions);
            return true;
        }

        return false;
    }

    impact(enemies, explosions) {
        this.impacted = true;
        explosions.push(new Explosion(this.targetX, this.targetY, this.explosionRadius, this.damage, 'fire'));

        enemies.forEach(enemy => {
            const dx = enemy.x - this.targetX;
            const dy = enemy.y - this.targetY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.explosionRadius) {
                enemy.takeDamage(this.damage);
            }
        });
    }

    render(ctx, camera) {
        if (this.warningTimer > 0) {
            const screenX = this.targetX - camera.x;
            const screenY = this.targetY - camera.y;
            const alpha = (Math.sin(this.warningTimer * 0.01) + 1) / 2;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(screenX, screenY, this.explosionRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
            return;
        }

        if (this.impacted) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();


        const trailLength = 8;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const normalizedVx = this.vx / speed;
        const normalizedVy = this.vy / speed;

        for (let i = 0; i < trailLength; i++) {
            const t = i / trailLength;
            const trailX = screenX - normalizedVx * i * 15;
            const trailY = screenY - normalizedVy * i * 15;
            const trailRadius = this.radius * (1 - t * 0.7);
            const alpha = 1 - t * t;


            ctx.globalAlpha = alpha * 0.6;
            ctx.fillStyle = i < 3 ? '#ff2200' : '#ff6600';
            ctx.beginPath();
            ctx.arc(trailX + (Math.random() - 0.5) * 2,
                trailY + (Math.random() - 0.5) * 2,
                trailRadius * (1.2 + Math.random() * 0.3), 0, Math.PI * 2);
            ctx.fill();


            if (i < 5) {
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = '#ffaa00';
                ctx.beginPath();
                ctx.arc(trailX, trailY, trailRadius * 0.7, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;


        const rockPoints = 12;
        const baseRadius = this.radius;


        ctx.fillStyle = '#2a1a0a';
        ctx.strokeStyle = '#1a0a00';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i <= rockPoints; i++) {
            const angle = (i * 2 * Math.PI) / rockPoints;

            const radiusVariation = 0.7 + Math.sin(angle * 3) * 0.2 + Math.sin(angle * 7) * 0.15;
            const radius = baseRadius * radiusVariation;
            const x = screenX + Math.cos(angle) * radius;
            const y = screenY + Math.sin(angle) * radius;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.strokeStyle = '#ff4400';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = 6;


        for (let i = 0; i < 3; i++) {
            const startAngle = (i * 2 * Math.PI) / 3 + Math.PI / 6;
            const endAngle = startAngle + Math.PI / 4;

            ctx.beginPath();
            ctx.moveTo(
                screenX + Math.cos(startAngle) * baseRadius * 0.3,
                screenY + Math.sin(startAngle) * baseRadius * 0.3
            );
            ctx.lineTo(
                screenX + Math.cos(endAngle) * baseRadius * 0.7,
                screenY + Math.sin(endAngle) * baseRadius * 0.7
            );
            ctx.stroke();
        }


        ctx.shadowBlur = 4;
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI / 4;
            const distance = baseRadius * (0.2 + Math.random() * 0.4);
            const x = screenX + Math.cos(angle) * distance;
            const y = screenY + Math.sin(angle) * distance;

            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2);
            ctx.fill();
        }


        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ff8800';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(
            screenX + normalizedVx * baseRadius * 0.3,
            screenY + normalizedVy * baseRadius * 0.3,
            baseRadius * 0.6,
            0, Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }
}