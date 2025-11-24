import { GameMath } from './utils.js';
import { SKILL_CONFIG } from './skillConfig.js';

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
            this.renderFireExplosion(ctx, screenX, screenY, alpha);
        } else if (this.type === 'acidic') {
            this.renderAcidicExplosion(ctx, screenX, screenY, alpha);
        } else if (this.type === 'frost') {
            this.renderFrostExplosion(ctx, screenX, screenY, alpha);
        }

        ctx.restore();
    }

    renderFireExplosion(ctx, screenX, screenY, alpha) {
        const flameCount = 12;
        const baseRadius = this.currentRadius;

        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ff2200';

        ctx.beginPath();
        for (let i = 0; i <= flameCount; i++) {
            const angle = (i * 2 * Math.PI) / flameCount;
            const flameVariation = 0.8 + Math.sin(angle * 3 + this.timer * 0.1) * 0.3;
            const radius = baseRadius * flameVariation;
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

        ctx.shadowBlur = 10;
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 5;
        ctx.fillStyle = '#ffff88';
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    renderAcidicExplosion(ctx, screenX, screenY, alpha) {

        const bubbleCount = 16;
        const baseRadius = this.currentRadius;

        ctx.shadowColor = '#44ff00';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#88ff00';

        ctx.beginPath();
        for (let i = 0; i <= bubbleCount; i++) {
            const angle = (i * 2 * Math.PI) / bubbleCount;
            const bubbleVariation = 0.6 + Math.sin(angle * 5 + this.timer * 0.15) * 0.4;
            const radius = baseRadius * bubbleVariation;
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

        ctx.shadowBlur = 6;
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const distance = baseRadius * (1.2 + Math.random() * 0.3);
            const dropletX = screenX + Math.cos(angle) * distance;
            const dropletY = screenY + Math.sin(angle) * distance;

            ctx.fillStyle = '#66dd00';
            ctx.beginPath();
            ctx.arc(dropletX, dropletY, baseRadius * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#aaff44';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ccff88';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#eeffaa';
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.15, 0, Math.PI * 2);
        ctx.fill();
    }

    renderFrostExplosion(ctx, screenX, screenY, alpha) {
        const shardCount = 8;
        const baseRadius = this.currentRadius;

        ctx.shadowColor = '#00aadd';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#88ddff';
        ctx.globalAlpha *= 0.8;

        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#44ccff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 6;

        for (let i = 0; i < shardCount; i++) {
            const angle = (i * 2 * Math.PI) / shardCount;
            const shardLength = baseRadius * (0.8 + Math.random() * 0.4);

            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(
                screenX + Math.cos(angle) * shardLength,
                screenY + Math.sin(angle) * shardLength
            );
            ctx.stroke();


            const midX = screenX + Math.cos(angle) * shardLength * 0.6;
            const midY = screenY + Math.sin(angle) * shardLength * 0.6;
            const perpAngle1 = angle + Math.PI / 2;
            const perpAngle2 = angle - Math.PI / 2;
            const perpLength = baseRadius * 0.2;

            ctx.beginPath();
            ctx.moveTo(midX + Math.cos(perpAngle1) * perpLength,
                midY + Math.sin(perpAngle1) * perpLength);
            ctx.lineTo(midX + Math.cos(perpAngle2) * perpLength,
                midY + Math.sin(perpAngle2) * perpLength);
            ctx.stroke();
        }


        ctx.fillStyle = '#aaeeff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();


        const coreSpikes = 6;
        ctx.fillStyle = '#ccf0ff';
        ctx.strokeStyle = '#88ddff';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (let i = 0; i < coreSpikes * 2; i++) {
            const angle = (i * Math.PI) / coreSpikes;
            const radius = i % 2 === 0 ? baseRadius * 0.4 : baseRadius * 0.2;
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


        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 3;
        ctx.beginPath();
        ctx.arc(screenX, screenY, baseRadius * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Projectile {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.damage = 0;
        this.radius = 4;
        this.lifetime = 0;
        this.maxLifetime = 3000;
        this.isActive = false;
        this.isHit = false;
        this.type = 'base';
    }

    init(...args) {
        throw new Error('init() must be implemented by subclass');
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.damage = 0;
        this.radius = 4;
        this.lifetime = 0;
        this.maxLifetime = 3000;
        this.isActive = false;
        this.isHit = false;
    }

    update(deltaTime) {
        if (!this.isActive || this.isHit) return true;

        this.lifetime += deltaTime;
        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);

        if (this.lifetime >= this.maxLifetime) {
            this.isActive = false;
            return true;
        }

        return false;
    }

    render(ctx, camera) {
        if (!this.isActive) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    setTarget(x, y, targetX, targetY, speed) {
        const distance = Math.sqrt((targetX - x) ** 2 + (targetY - y) ** 2);
        if (distance > 0) {
            this.vx = ((targetX - x) / distance) * speed;
            this.vy = ((targetY - y) / distance) * speed;
        } else {
            this.vx = 0;
            this.vy = 0;
        }
    }
}

export class MagicMissile extends Projectile {
    constructor() {
        super();

        this.type = 'magicMissile';
        this.trail = [];
        this.maxTrailLength = 8;
        this.speed = 400;
    }

    init(x, y, targetX, targetY, damage, speed) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.radius = 4;
        this.speed = speed;
        this.lifetime = 0;
        this.maxLifetime = 3000;
        this.isActive = true;
        this.isHit = false;
        this.trail.length = 0;

        this.setTarget(x, y, targetX, targetY, speed);
    }

    reset() {
        super.reset();
        this.trail.length = 0;
        this.speed = 400;
    }

    update(deltaTime, enemies) {
        if (!this.isActive) return true;

        const mustRemove = super.update(deltaTime);
        if (mustRemove) return true;

        this.trail.push({ x: this.x, y: this.y, time: this.lifetime });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        const nearbyEnemies = window.game.spatialGrid.getObjectsInRange(
            this.x, this.y,
            this.radius
        );

        nearbyEnemies.forEach(enemy => {
            if (!enemy.isActive) return;

            const distance = GameMath.getDistance(this.x, this.y, enemy.x, enemy.y);

            if (distance < this.radius + enemy.radius) {
                enemy.takeDamage(this.damage);

                this.isHit = true;
                this.isActive = false;
                return true;
            }
        });

        return false;
    }

    render(ctx, camera) {
        if (!this.isActive) return;

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

export class Fireball extends Projectile {
    constructor() {
        super();
        this.type = 'fireball';
        this.explosionRadius = 200;
        this.speed = 250;
        this.radius = 8;
        this.exploded = false;
    }

    init(x, y, targetX, targetY, damage, radius) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.explosionRadius = radius;
        this.lifetime = 0;
        this.maxLifetime = 3000;
        this.isActive = true;
        this.isHit = false;
        this.exploded = false;
        this.radius = 8;
        this.speed = 250;

        this.setTarget(x, y, targetX, targetY, this.speed);
    }

    update(deltaTime, enemies, explosions) {
        if (this.exploded || !this.isActive) return true;

        const mustRemove = super.update(deltaTime);
        if (mustRemove) return true;

        const nearbyEnemies = window.game.spatialGrid.getObjectsInRange(
            this.x, this.y,
            this.radius
        );

        for (let enemy of nearbyEnemies) {
            if (!enemy.isActive) continue;

            const distance = GameMath.getDistance(this.x, this.y, enemy.x, enemy.y);

            if (distance < (this.radius + enemy.radius)) {
                this.explode(nearbyEnemies, explosions);
                return true;
            }
        }

        return false
    }

    explode(enemies, explosions) {
        if (this.exploded) return;

        this.isActive = false;
        this.isHit = true;
        this.exploded = true;

        const explosion = new Explosion(this.x, this.y, this.explosionRadius, this.damage, 'fire');
        explosions.push(explosion);

        enemies.forEach(enemy => {
            const distance = GameMath.getDistance(this.x, this.y, enemy.x, enemy.y);

            if (distance < this.explosionRadius) {
                enemy.takeDamage(this.damage);
            }
        });
    }

    render(ctx, camera) {
        if (this.exploded || !this.isActive) return;

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

export class ChainLightning extends Projectile {
    constructor() {
        super();
        this.type = 'chainLightning';
        this.chains = 0;
        this.range = 0;
        this.hitEnemies = new Set();
        this.lightningChain = [];
        this.duration = 0;
        this.timer = 0;
    }

    init(x, y, player, enemies, damage, chains, range) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.chains = chains;
        this.range = range;
        this.lightningChain = [];
        this.hitEnemies.clear();
        this.duration = 500;
        this.timer = 0;
        this.isActive = true;
        this.isHit = false;

        this.createChain(player, enemies);
    }

    createChain(player, enemies) {
        let currentPos = { x: this.x, y: this.y };
        let currentFrom = player;

        for (let i = 0; i < this.chains && enemies.length > 0; i++) {
            let nearestEnemy = null;
            let nearestDistance = this.range;

            enemies.forEach(enemy => {
                if (enemy.isActive == false) return;

                if (this.hitEnemies.has(enemy)) return;

                const distance = GameMath.getDistance(currentPos.x, currentPos.y, enemy.x, enemy.y);

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = enemy;
                }
            });

            if (nearestEnemy) {
                this.lightningChain.push({
                    from: currentFrom,
                    to: { x: nearestEnemy.x, y: nearestEnemy.y }
                });

                nearestEnemy.takeDamage(this.damage);
                this.hitEnemies.add(nearestEnemy);
                currentFrom = { x: nearestEnemy.x, y: nearestEnemy.y };
            } else {
                break;
            }
        }
    }

    update(deltaTime) {
        if (!this.isActive) return true;

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
            if (!chain.from || !chain.to) return;

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

export class ArcingShock extends Projectile {
    constructor() {
        super();
        this.type = 'arcingShock';
        this.chains = 0;
        this.range = 0;
        this.hitEnemies = new Set();
        this.lightningChain = [];
        this.duration = 0;
        this.timer = 0;
    }

    init(x, y, player, enemies, damage, range) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.cone = 90;
        this.range = range;
        this.lightningChain = [];
        this.hitEnemies.clear();
        this.duration = 500;
        this.timer = 0;
        this.isActive = true;
        this.isHit = false;

        this.createConeLightning(player, enemies, this.cone, 200);
    }

    createConeLightning(player, enemies, coneWidthDeg = 60, maxRange = 400) {
        this.lightningChain = [];

        let currentPos = { x: this.x, y: this.y };
        let nearestEnemy = null;
        let nearestDistance = maxRange;

        for (let enemy of enemies) {
            if (!enemy.isActive) continue;
            if (this.hitEnemies.has(enemy)) continue;

            if (typeof enemy.x !== 'number' || typeof enemy.y !== 'number' ||
                isNaN(enemy.x) || isNaN(enemy.y)) {
                continue;
            }

            const distance = GameMath.getDistance(currentPos.x, currentPos.y, enemy.x, enemy.y);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestEnemy = enemy;
            }
        }

        if (!nearestEnemy) return;

        const coneAngle = Math.atan2(
            nearestEnemy.y - currentPos.y,
            nearestEnemy.x - currentPos.x
        );

        // this.debugConeData = {
        //     coneAngle: coneAngle,
        //     nearestEnemy: nearestEnemy,
        //     maxRange: maxRange
        // };

        for (let enemy of enemies) {
            if (!enemy.isActive) continue;
            if (this.hitEnemies.has(enemy)) continue;

            if (typeof enemy.x !== 'number' || typeof enemy.y !== 'number' ||
                isNaN(enemy.x) || isNaN(enemy.y)) {
                console.warn('Enemy has invalid coordinates:', enemy);
                continue;
            }

            const dx = enemy.x - currentPos.x;
            const dy = enemy.y - currentPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > maxRange) continue;

            const angleToEnemy = Math.atan2(dy, dx);
            let diff = angleToEnemy - coneAngle;

            diff = (diff + Math.PI) % (2 * Math.PI) - Math.PI;

            const coneHalfAngle = (coneWidthDeg / 2) * Math.PI / 180;
            if (Math.abs(diff) <= coneHalfAngle) {
                this.lightningChain.push({
                    from: { x: currentPos.x, y: currentPos.y },
                    to: { x: enemy.x, y: enemy.y }
                });

                enemy.takeDamage(this.damage);
                this.hitEnemies.add(enemy);
            }
        }
    }

    update(deltaTime) {
        if (!this.isActive) return true;

        this.timer += deltaTime;

        return this.timer > this.duration;
    }

    render(ctx, camera) {
        const alpha = Math.max(0, 1 - (this.timer / this.duration));

        // this.renderConeDebug(ctx, camera, alpha * 0.3);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#e9b91dff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ebee38ff';
        ctx.shadowBlur = 10;

        this.lightningChain.forEach(chain => {
            if (!chain.from || !chain.to) return;

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

    renderConeDebug(ctx, camera, alpha = 0.3) {
        if (!this.debugConeData) return;

        ctx.save();
        ctx.globalAlpha = alpha;

        const centerX = this.x - camera.x;
        const centerY = this.y - camera.y;

        ctx.strokeStyle = '#ffff00'; 
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, this.range, 0, Math.PI * 2);
        ctx.stroke();

        if (this.debugConeData.coneAngle !== undefined) {
            const coneHalfAngle = (this.cone / 2) * Math.PI / 180;
            const startAngle = this.debugConeData.coneAngle - coneHalfAngle;
            const endAngle = this.debugConeData.coneAngle + coneHalfAngle;

            ctx.strokeStyle = '#ff0080'; 
            ctx.fillStyle = '#ff008020'; 
            ctx.lineWidth = 2;
            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, this.range, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            if (this.debugConeData.nearestEnemy) {
                ctx.strokeStyle = '#ff0000'; 
                ctx.lineWidth = 1;
                ctx.setLineDash([3, 3]);
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(
                    this.debugConeData.nearestEnemy.x - camera.x,
                    this.debugConeData.nearestEnemy.y - camera.y
                );
                ctx.stroke();
            }
        }

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();

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

export class IceSpike extends Projectile {
    constructor() {
        super();
        this.type = 'iceSpike';
        this.slowDuration = 0;
        this.slowAmount = 0;
    }

    init(x, y, targetX, targetY, damage, slowDuration, slowAmount) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.slowDuration = slowDuration;
        this.slowAmount = slowAmount;
        this.lifetime = 0;
        this.maxLifetime = 4000;
        this.isActive = true;
        this.isHit = false;
        this.speed = 300;
        this.radius = 6;
        this.explosionRadius = 80;

        this.setTarget(x, y, targetX, targetY, this.speed);
    }

    update(deltaTime, enemies, explosions) {
        if (!this.isActive) return true;
        if (this.isHit) return true;

        const mustRemove = super.update(deltaTime);
        if (mustRemove) return true;

        const nearbyEnemies = window.game.spatialGrid.getObjectsInRange(
            this.x, this.y,
            this.radius
        );

        for (let enemy of nearbyEnemies) {
            if (!enemy.isActive) continue;

            const distance = GameMath.getDistance(this.x, this.y, enemy.x, enemy.y);

            if (distance < this.radius + enemy.radius) {
                this.hit(nearbyEnemies, explosions);
                return true;
            }
        };

        return this.lifetime > this.maxLifetime;
    }

    hit(enemies, explosions) {
        this.isActive = false;
        this.isHit = true;
        const explosion = new Explosion(this.x, this.y, this.explosionRadius, this.damage, 'frost');
        explosions.push(explosion);

        enemies.forEach(enemy => {
            const distance = GameMath.getDistance(this.x, this.y, enemy.x, enemy.y);

            if (distance < this.explosionRadius) {
                enemy.takeDamage(this.damage);
                enemy.applySlow(this.slowAmount, this.slowDuration);
            }
        });
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
export class Meteor extends Projectile {
    constructor() {
        super();
        this.type = 'meteor';
        this.speed = 400;
        this.radius = 12;
    }

    init(targetX, targetY, damage, radius, warningTime = 200) {
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
        this.isActive = true;
        this.isHit = false;

        this.setTarget(this.x, this.y, targetX, targetY, this.speed);
    }

    update(deltaTime, enemies, explosions) {
        if (!this.isActive) return true;

        const mustRemove = super.update(deltaTime);
        if (mustRemove) return true;

        if (this.warningTimer > 0) {
            this.warningTimer -= deltaTime;
            return false;
        }

        if (this.impacted) return true;

        this.x += this.vx * (deltaTime / 1000);
        this.y += this.vy * (deltaTime / 1000);

        const nearbyEnemies = window.game.spatialGrid.getObjectsInRange(
            this.x, this.y,
            this.radius
        );

        const distance = GameMath.getDistance(this.x, this.y, this.targetX, this.targetY);

        if (distance < 20) {
            this.impact(nearbyEnemies, explosions);
            return true;
        }

        return false;
    }

    impact(enemies, explosions) {
        this.impacted = true;
        this.isActive = false;
        this.isHit = true;
        explosions.push(new Explosion(this.targetX, this.targetY, this.explosionRadius, this.damage, 'fire'));

        enemies.forEach(enemy => {
            const distance = GameMath.getDistance(this.targetX, this.targetY, enemy.x, enemy.y);

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