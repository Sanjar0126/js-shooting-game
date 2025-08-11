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
        baseCooldown: 400,
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
        this.playerSkills = {};
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
        this.playerSkills = {};
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
        this.hitEnemies = new Set();

        this.trail = [];
        this.maxTrailLength = 8;
    }

    update(deltaTime, enemies) {
        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);
        this.lifetime += deltaTime;

        this.trail.push({ x: this.x, y: this.y, time: this.lifetime });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        enemies.forEach(enemy => {
            if (this.hitEnemies.has(enemy)) return;

            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + enemy.radius) {
                enemy.takeDamage(this.damage);

                if (window.game && window.game.damageNumbers) {
                    window.game.damageNumbers.addDamageNumber(
                        enemy.x + (Math.random() - 0.5) * 20,
                        enemy.y - 10,
                        this.damage,
                        'skill'
                    );
                }

                this.hitEnemies.add(enemy);
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

                if (window.game && window.game.damageNumbers) {
                    window.game.damageNumbers.addDamageNumber(
                        enemy.x + (Math.random() - 0.5) * 30,
                        enemy.y - 15,
                        this.damage,
                        'explosion'
                    );
                }
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

            const midX = (fromX + toX) / 2 + (Math.random() - 0.5) * 20;
            const midY = (fromY + toY) / 2 + (Math.random() - 0.5) * 20;

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.quadraticCurveTo(midX, midY, toX, toY);
            ctx.stroke();
        });

        ctx.restore();
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
        ctx.fillStyle = '#00ccff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
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
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.arc(screenX - this.vx * 0.05, screenY - this.vy * 0.05, this.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff8800';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}