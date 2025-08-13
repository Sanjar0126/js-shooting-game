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
            player.shootCooldownMultiplier -= 0.1;
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
        name: 'Ice Bomb',
        description: 'Summons a bomb of ice that damages and slows enemies.',
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