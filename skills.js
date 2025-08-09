// export const SKILL_CONFIG = {
//     damageBoost: {
//         name: 'Damage Boost',
//         description: 'Increases the damage dealt by the player.',
//         icon: '💥',
//         type: 'passive',
//         maxLevel: 5,
//         effect: (player, level) => {
//             player.damageMultiplier += 0.25;
//         },
//     },
//     fireRate: {
//         name: 'Fire Rate',
//         description: 'Reduce shooting cooldown.',
//         icon: '⚡',
//         type: 'passive',
//         maxLevel: 5,
//         effect: (player, level) => {
//             player.shootCooldownMultiplier *= 0.8;
//         },
//     },
//     health: {
//         name: 'Health',
//         description: 'Increases the player\'s maximum health.',
//         icon: '❤️',
//         type: 'passive',
//         maxLevel: 5,
//         effect: (player, level) => {
//             player.maxHealth += 20;
//             player.health = Math.min(player.currentHealth + 20, player.maxHealth);
//         },
//     },
//     speed: {
//         name: 'Agility',
//         description: 'Increases the player\'s movement speed.',
//         icon: '👟',
//         type: 'passive',
//         maxLevel: 4,
//         effect: (player, level) => {
//             player.speedMultiplier += 0.2;
//         },
//     },

//     fireball: {
//         name: 'Fireball',
//         description: 'Launches explosive fireball.',
//         icon: '🔥',
//         type: 'active',
//         maxLevel: 5,
//         baseCooldown: 3000,
//         baseDamege: 80,
//         baseRadius: 60,
//         effect: (player, level) => {
//             if (!player.skills.fireball) {
//                 player.skills.fireball = {
//                     level: 0,
//                     cooldown: 0,
//                     damage: 80,
//                     radius: 60,
//                     speed: 250
//                 };
//             }
//             player.skills.fireball.level = level;
//             player.skills.fireball.damage = 80 + (level - 1) * 20;
//             player.skills.fireball.radius = 60 + (level - 1) * 10;
//         },
//     },

//     chainLightning: {
//         name: 'Chain Lightning',
//         description: 'Unleashes a chain lightning attack.',
//         icon: '⚡️',
//         type: 'active',
//         maxLevel: 5,
//         baseCooldown: 3000,
//         baseDamage: 60,
//         baseChains: 3,
//         effect: (player, level) => {
//             if (!player.skills.chainLightning) {
//                 player.skills.chainLightning = {
//                     level: 0,
//                     cooldown: 0,
//                     damage: 60,
//                     chains: 3,
//                     range: 250,
//                 };
//             }
//             player.skills.chainLightning.level = level;
//             player.skills.chainLightning.damage = 60 + (level - 1) * 15;
//             player.skills.chainLightning.chains = 3 + (level - 1) * 2;
//         },
//     },

//     iceSpike: {
//         name: 'Ice Spike',
//         description: 'Summons a spike of ice that damages and slows enemies.',
//         icon: '❄️',
//         type: 'active',
//         maxLevel: 5,
//         baseCooldown: 4000,
//         baseDamage: 50,
//         baseSlowDuration: 2000,
//         baseSlowAmount: 0.5,
//         effect: (player, level) => {
//             if (!player.skills.iceSpike) {
//                 player.skills.iceSpike = {
//                     level: 0,
//                     cooldown: 0,
//                     damage: 50,
//                     slowDuration: 2000,
//                     slowAmount: 0.5,
//                     range: 300,
//                 };
//             }
//             player.skills.iceSpike.level = level;
//             player.skills.iceSpike.damage = 50 + (level - 1) * 15;
//             player.skills.iceSpike.slowDuration = 2000 + (level - 1) * 500;
//         },
//     },

//     meteor: {
//         name: 'Meteor Strike',
//         description: 'Calls down a meteor that deals massive damage.',
//         icon: '☄️',
//         type: 'active',
//         maxLevel: 5,
//         baseCooldown: 8000,
//         baseDamage: 100,
//         baseRadius: 80,
//         baseCount: 1,
//         effect: (player, level) => {
//             if (!player.skills.meteor) {
//                 player.skills.meteor = {
//                     level: 0,
//                     cooldown: 0,
//                     damage: 100,
//                     radius: 80,
//                     speed: 300,
//                     count: 1,
//                 };
//             }
//             player.skills.meteor.level = level;
//             player.skills.meteor.damage = 100 + (level - 1) * 25;
//             player.skills.meteor.count = level;
//         },
//     },

//     shield: {
//         name: 'Shield',
//         description: 'Grants a protective shield that absorbs damage.',
//         icon: '🛡️',
//         type: 'active',
//         maxLevel: 4,
//         baseCooldown: 8000,
//         baseDuration: 1000,
//         effect: (player, level) => {
//             if (!player.skills.shield) {
//                 player.skills.shield = {
//                     level: 0,
//                     cooldown: 0,
//                     duration: 1000,
//                     active: false,
//                     timer: 0
//                 };
//             }
//             player.skills.shield.level = level;
//             player.skills.shield.duration = 1000 + (level - 1) * 500;
//         },
//     }
// }

export const SKILL_CONFIG = {
    fireball: {
        name: 'Fireball',
        description: 'Launches explosive fireball.',
        icon: '🔥',
        type: 'active',
        maxLevel: 5,
        baseCooldown: 3000,
        baseDamege: 80,
        baseRadius: 60,
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
        for (let i = 0; i < Math.min(count, availableSkills.length); i++) {
            const randomIndex = Math.floor(Math.random() * availableSkills.length);
            const skillId = availableSkills.splice(randomIndex, 1)[0];
            choices.push(skillId);
        }

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