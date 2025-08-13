import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { DeathAnimation, LevelUpEffect } from './animations.js';
import { FPSMeter } from './debug.js';
import { VirtualJoystick } from './virtualJoystick.js';
import { SkillSystem, Fireball, Explosion, ChainLightning, IceSpike, Meteor, MagicMissile, ArcingShock } from './skills.js';
import { DamageNumberSystem } from './damageNumbers.js';
import { GameMath } from './utils.js';
import { ObjectPool, ProjectilePool } from './objectPool.js';
import { SKILL_CONFIG } from './skillConfig.js';


class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.smoothing = 0.1;
    }

    update(target) {
        const targetX = target.x - this.width / 2;
        const targetY = target.y - this.height / 2;

        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;
    }

    getWorldBounds() {
        return {
            left: this.x - 100,
            right: this.x + this.width + 100,
            top: this.y - 100,
            bottom: this.y + this.height + 100
        };
    }
}

class SpatialGrid {
    constructor(worldHeight, worldWidth, cellSize = 200) {
        this.cellSize = cellSize;
        this.cols = Math.ceil(worldWidth / cellSize);
        this.rows = Math.ceil(worldHeight / cellSize);
        this.grid = new Array(this.cols * this.rows).fill(null).map(() => []);
    }

    clear() {
        this.grid.forEach(cell => cell.length = 0);
    }

    getGridIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return row * this.cols + col;
    }

    addObject(object) {
        const index = this.getGridIndex(object.x, object.y);
        if (index >= 0 && index < this.grid.length) {
            this.grid[index].push(object);
        }
    }

    getObjectsInRange(x, y, range) {
        const cellRange = Math.ceil(range / this.cellSize);
        const centerCol = Math.floor(x / this.cellSize);
        const centerRow = Math.floor(y / this.cellSize);
        const objects = [];

        for (let row = centerRow - cellRange; row <= centerRow + cellRange; row++) {
            for (let col = centerCol - cellRange; col <= centerCol + cellRange; col++) {
                if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                    const index = row * this.cols + col;
                    objects.push(...this.grid[index]);
                }
            }
        }

        return objects;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.width = this.canvas.clientWidth || 800;
        this.height = this.canvas.clientHeight || 600;
        this.devicePixelRatio = window.devicePixelRatio || 1;

        this.baseWidth = 800;
        this.baseHeight = 600;
        this.scale = 1;


        this.worldWidth = 6400;
        this.worldHeight = 6400;

        this.spatialGrid = new SpatialGrid(this.worldHeight, this.worldWidth, 200);

        this.camera = new Camera(this.width, this.height);

        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'

        this.isRunning = false;
        this.score = 0;

        this.wave = 1;
        this.waveTimer = 0;
        this.waveDuration = 60000; // 60 seconds 
        this.difficultyMultiplier = 1.0;

        this.playerLevel = 1;
        this.currentXP = 0;
        this.xpToNextLevel = 100;
        this.totalXP = 0;


        this.keys = {};
        this.mouse = { x: 0, y: 0, isPressed: false };

        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;

        this.fpsMeter = new FPSMeter();

        this.isMobile = this.detectMobile();
        this.movementJoystick = null;

        this.skillSystem = new SkillSystem();

        this.player = null;
        this.explosions = [];
        this.deathAnimations = [];
        this.enemyBullets = [];

        this.skillProjectilePool = new ProjectilePool()

        this.enemyPool = new ObjectPool(
            () => new Enemy(0, 0, 'basic'),
            (enemy) => enemy.stop(),
            100);

        this.showingSkillSelection = false;
        this.skillChoices = [];

        this.damageNumbers = new DamageNumberSystem();

        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }

    init() {
        this.setupEventListeners();

        if (this.isMobile) {
            this.setupMobileControls();
        }

        this.showMenu();
        this.gameLoop();
    }

    setupMobileControls() {
        if (this.isMobile) {
            this.movementJoystick = new VirtualJoystick(document.body);
        }
    }

    showMenu() {
        this.gameState = 'menu';
        this.isRunning = false;
        document.getElementById('mainMenu').style.display = 'flex';
        document.getElementById('ui').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
    }

    startNewGame() {
        this.gameState = 'playing';
        this.isRunning = true;

        this.score = 0;
        this.wave = 1;
        this.waveTimer = 0;
        this.difficultyMultiplier = 1.0;

        this.enemyBullets = [];
        this.deathAnimations = [];

        this.playerLevel = 1;
        this.currentXP = 0;
        this.xpToNextLevel = 100;
        this.totalXP = 0;

        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
        SKILL_CONFIG.magicMissile.effect(this.player, 1);

        this.enemySpawnTimer = 0;
        this.waveTimer = 0;
        this.enemyCount = 0;

        this.camera.x = 0;
        this.camera.y = 0;

        this.skillSystem.reset();
        this.explosions = [];
        this.showingSkillSelection = false;

        this.damageNumbers.clear();

        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('ui').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('skillSelection').style.display = 'none';

        this.showFPS = document.getElementById('fpsToggle').checked;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            if (this.showingSkillSelection) {
                if (e.code === 'Digit1' || e.code === 'Numpad1') {
                    this.selectSkillByIndex(0);
                    e.preventDefault();
                } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
                    this.selectSkillByIndex(1);
                    e.preventDefault();
                } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
                    this.selectSkillByIndex(2);
                    e.preventDefault();
                }
            }

            if (e.code === 'Escape') {
                if (this.gameState === 'playing') {
                    this.pauseGame();
                } else if (this.gameState === 'paused') {
                    this.resumeGame();
                }
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left);
            this.mouse.y = (e.clientY - rect.top);
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.mouse.isPressed = true;
            }
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouse.isPressed = false;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.isPressed = false;
        });
    }

    pauseGame() {
        this.gameState = 'paused';
        this.isRunning = false;
    }

    resumeGame() {
        this.gameState = 'playing';
        this.isRunning = true;
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.fpsMeter.update(currentTime);

        if (this.gameState === 'playing' && this.isRunning && !this.showingSkillSelection) {
            this.update(deltaTime);
        }

        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    handleMobileInput(deltaTime) {
        if (!this.movementJoystick || this.gameState !== 'playing' || this.showingSkillSelection) {
            return;
        }

        const moveValue = this.movementJoystick.getValue();

        this.keys['KeyW'] = false;
        this.keys['KeyS'] = false;
        this.keys['KeyA'] = false;
        this.keys['KeyD'] = false;

        const threshold = 0.2;
        if (moveValue.y < -threshold) this.keys['KeyW'] = true;
        if (moveValue.y > threshold) this.keys['KeyS'] = true;
        if (moveValue.x < -threshold) this.keys['KeyA'] = true;
        if (moveValue.x > threshold) this.keys['KeyD'] = true;
    }

    update(deltaTime) {
        if (this.isMobile && this.movementJoystick) {
            this.handleMobileInput(deltaTime);
        }

        const mouseWorldPos = this.isMobile ? null : {
            x: this.mouse.x + this.camera.x,
            y: this.mouse.y + this.camera.y
        };


        this.player.update(deltaTime, this.keys, mouseWorldPos);
        this.camera.update(this.player);

        this.player.x = Math.max(this.player.radius, Math.min(this.worldWidth - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.worldHeight - this.player.radius, this.player.y));

        this.waveTimer += deltaTime;
        if (this.waveTimer >= this.waveDuration) {
            this.nextWave();
        }

        const activeEnemies = this.enemyPool.objects;

        this.spatialGrid.clear();
        activeEnemies.forEach(enemy => {
            this.spatialGrid.addObject(enemy);
        });

        for (let i = activeEnemies.length - 1; i >= 0; i--) {
            const enemy = activeEnemies[i];

            if (!enemy.isActive) {
                this.enemyPool.release(enemy);
                continue;
            }

            enemy.update(deltaTime, this.player, this.enemyBullets);

            if (enemy.health <= 0) {
                this.gainExperience(enemy.xpValue);
                this.score += enemy.scoreValue;

                this.deathAnimations.push(new DeathAnimation(enemy.x, enemy.y, 'enemy'));

                this.enemyPool.release(enemy);
                this.enemyCount--;
            }
        }

        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            this.enemyBullets[i].update(deltaTime);
            if (this.enemyBullets[i].isExpired()) {
                this.enemyBullets.splice(i, 1);
            }
        }

        for (let i = this.deathAnimations.length - 1; i >= 0; i--) {
            if (this.deathAnimations[i].update(deltaTime)) {
                this.deathAnimations.splice(i, 1);
            }
        }

        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer > Math.max(1000 - this.wave * 50, 200)) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
            this.enemyCount++;
        }

        const projectiles = this.skillProjectilePool.projectiles;

        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];

            if (!projectile.isActive) continue;

            const shouldRemove = projectile.update(deltaTime, this.enemies, this.explosions);

            if (shouldRemove || !projectile.isActive) {
                this.skillProjectilePool.release(projectile);
            }
        }

        for (let i = this.explosions.length - 1; i >= 0; i--) {
            if (this.explosions[i].update(deltaTime)) {
                this.explosions.splice(i, 1);
            }
        }

        this.damageNumbers.update(deltaTime);

        this.handleSkillInput();

        this.checkCollisions();
        this.updateUI();

        if (this.player.isDead) {
            if (this.player.deathTimer === deltaTime) {
                this.deathAnimations.push(new DeathAnimation(this.player.x, this.player.y, 'player'));
            }

            if (this.player.deathTimer > 2000) {
                this.gameOver();
            }
        }
    }

    handleSkillInput() {
        const playerSkills = Object.keys(this.player.skills);
        if (playerSkills.length === 0) return;

        const nearestEnemy = GameMath.findNearestEnemy(1000, this.player.x, this.player.y);

        playerSkills.forEach(skillName => {
            const skill = this.player.skills[skillName];
            if (!skill || skill.cooldown > 0) return;

            const range = SKILL_CONFIG[skillName].baseRange || 400;
            let targets = [];

            let aimNearest = SKILL_CONFIG[skillName].aimNearestEnemy || false;
            let aimMultiple = SKILL_CONFIG[skillName].aimMultipleEnemies || false;
            let count = 1;

            if (aimMultiple) {
                count = skill.count || 1;
            }

            if (aimNearest) {
                if (!nearestEnemy) return;
                targets.push({
                    x: nearestEnemy.x || 0,
                    y: nearestEnemy.y || 0
                });
            } else {
                let randomEnemies = this.findRandomEnemy(range * 1.2, count);
                if (randomEnemies) {
                    randomEnemies.forEach(enemy => {
                        targets.push({
                            x: enemy.x,
                            y: enemy.y
                        });
                    });
                }
            }

            if (targets.length > 0) {
                this.player.useSkill(
                    skillName,
                    targets,
                    this.enemyPool.objects,
                    this.skillProjectilePool,
                    this.explosions
                );
            }
        });
    }

    drawLineToNearestEnemy() {
        const nearestEnemy = GameMath.findNearestEnemy(1000, this.player.x, this.player.y);
        if (!nearestEnemy) return;

        const playerScreenX = this.player.x - this.camera.x;
        const playerScreenY = this.player.y - this.camera.y;
        const enemyScreenX = nearestEnemy.x - this.camera.x;
        const enemyScreenY = nearestEnemy.y - this.camera.y;

        this.ctx.save();
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.7;

        this.ctx.beginPath();
        this.ctx.moveTo(playerScreenX, playerScreenY);
        this.ctx.lineTo(enemyScreenX, enemyScreenY);
        this.ctx.stroke();

        this.ctx.restore();
    }

    findRandomEnemy(maxRange = Infinity, count = 1) {
        const enemiesInRange = this.enemyPool.objects.filter(enemy => {
            if (!enemy.isActive) {
                this.enemyPool.release(enemy);
                return false;
            };

            const distance = GameMath.getDistance(this.player.x, this.player.y, enemy.x, enemy.y);

            return distance <= maxRange;
        });

        if (enemiesInRange.length === 0) {
            return null;
        }

        let chosen = [];
        let usedIndices = new Set();

        while (chosen.length < count && chosen.length < enemiesInRange.length) {
            const index = Math.floor(Math.random() * enemiesInRange.length);
            if (!usedIndices.has(index)) {
                usedIndices.add(index);
                chosen.push(enemiesInRange[index]);
            }
        }

        return chosen;
    }


    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.gameState === 'playing') {
            this.drawGrid();
            this.player.render(this.ctx, this.camera);
            this.enemyPool.objects.forEach(enemy => {
                if (enemy.isActive) {
                    enemy.render(this.ctx, this.camera);
                } else {
                    this.enemyPool.release(enemy);
                }
            });
            this.enemyBullets.forEach(bullet => bullet.render(this.ctx, this.camera));
            this.deathAnimations.forEach(animation => animation.render(this.ctx, this.camera));
            this.skillProjectilePool.projectiles.forEach(projectile => {
                if (projectile.isActive) {
                    projectile.render(this.ctx, this.camera)
                } else {
                    this.skillProjectilePool.release(projectile);
                }
            });
            this.explosions.forEach(explosion => explosion.render(this.ctx, this.camera));

            this.damageNumbers.render(this.ctx, this.camera);
            this.renderSkillUI();
            this.drawWorldBounds();

            this.drawLineToNearestEnemy();

            if (this.showingSkillSelection) {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                this.ctx.fillRect(0, 0, this.width, this.height);
            }
        } else if (this.gameState === 'menu') {
            this.drawMenuBackground();
        } else if (this.gameState === 'paused') {
            this.drawGrid();
            this.player.render(this.ctx, this.camera);
            this.enemyPool.objects.forEach(enemy => enemy.render(this.ctx, this.camera));
            this.enemyBullets.forEach(bullet => bullet.render(this.ctx, this.camera));
            this.deathAnimations.forEach(animation => animation.render(this.ctx, this.camera));
            this.drawWorldBounds();

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Press ESC to resume', this.width / 2, this.height / 2 + 40);
        }

        if (this.showFPS) {
            this.fpsMeter.render(this.ctx);
        }
    }

    renderSkillUI() {
        const skills = Object.keys(this.player.skills);
        if (skills.length === 0) return;

        const startX = 10;
        const startY = this.height - 60;
        const skillSize = 40;
        const spacing = 50;

        skills.forEach((skillName, index) => {
            const skill = this.player.skills[skillName];
            const x = startX + index * spacing;
            const y = startY;

            this.ctx.fillStyle = skill.cooldown > 0 ? '#666' : '#333';
            this.ctx.fillRect(x, y, skillSize, skillSize);

            if (skill.cooldown > 0) {
                const cooldownPercent = skill.cooldown / (3000);
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(x, y, skillSize, skillSize * cooldownPercent);
            }

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                skillName.charAt(0).toUpperCase(),
                x + skillSize / 2,
                y + skillSize / 2 + 7
            );
        });
    }

    drawMenuBackground() {
        const time = Date.now() * 0.001;
        for (let i = 0; i < 50; i++) {
            const x = (Math.sin(time + i) * 200 + this.width / 2) % this.width;
            const y = (Math.cos(time + i * 0.5) * 150 + this.height / 2) % this.height;
            const size = Math.sin(time + i * 2) * 3 + 5;

            this.ctx.fillStyle = `rgba(76, 175, 80, ${0.1 + Math.sin(time + i) * 0.1})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    nextWave() {
        this.wave++;
        this.waveTimer = 0;

        this.difficultyMultiplier *= 1.08;

        console.log(`Wave ${this.wave}! Difficulty: ${this.difficultyMultiplier.toFixed(2)}x`);

        this.showWaveNotification();
    }

    showWaveNotification() {
        console.log(`Wave ${this.wave} begins!`);
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.isRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    drawGrid(camera = this.camera) {
        const gridSize = 100;
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;

        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;

        for (let x = startX; x < camera.x + camera.width + gridSize; x += gridSize) {
            const screenX = x - camera.x;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, camera.height);
            this.ctx.stroke();
        }

        for (let y = startY; y < camera.y + camera.height + gridSize; y += gridSize) {
            const screenY = y - camera.y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(camera.width, screenY);
            this.ctx.stroke();
        }
    }

    drawWorldBounds(camera = this.camera) {
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 3;

        const screenLeft = -camera.x;
        const screenTop = -camera.y;
        const screenRight = this.worldWidth - camera.x;
        const screenBottom = this.worldHeight - camera.y;

        this.ctx.strokeRect(screenLeft, screenTop, this.worldWidth, this.worldHeight);
    }

    handleResize(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;

        // this.scale = 1;

        if (this.camera) {
            this.camera.width = newWidth;
            this.camera.height = newHeight;
        }

        // this.canvas.width = newWidth;
        // this.canvas.height = newHeight;
    }

    spawnEnemy() {
        let enemyType = 'basic';
        const rand = Math.random();
        const waveMultiplier = Math.min(this.wave / 10, 1);

        if (rand < 0.1 + waveMultiplier * 0.1) {
            enemyType = 'exploder';
        } else if (rand < 0.2 + waveMultiplier * 0.15) {
            enemyType = 'shooter';
        } else if (rand < 0.35 + waveMultiplier * 0.2) {
            enemyType = 'tank';
        } else if (rand < 0.6) {
            enemyType = 'fast';
        }

        const spawnDistance = 400;
        const angle = Math.random() * Math.PI * 2;

        const x = this.player.x + Math.cos(angle) * spawnDistance;
        const y = this.player.y + Math.sin(angle) * spawnDistance;

        const clampedX = Math.max(50, Math.min(this.worldWidth - 50, x));
        const clampedY = Math.max(50, Math.min(this.worldHeight - 50, y));

        const enemy = this.enemyPool.get();
        enemy.restart(clampedX, clampedY, enemyType);
    }

    checkCollisions() {
        const activeEnemies = this.enemyPool.objects;

        activeEnemies.forEach(enemy => {
            if (!enemy.isActive) {
                this.enemyPool.release(enemy);
                return;
            }

            if (this.isColliding(this.player, enemy)) {
                this.player.takeDamage(enemy.damage * this.player.damageReduction);
                if (enemy.type !== 'exploder') {
                    enemy.health = 0;
                }
            }
        });

        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            if (this.isColliding(this.player, this.enemyBullets[i])) {
                this.player.takeDamage(this.enemyBullets[i].damage * this.player.damageReduction);
                this.enemyBullets.splice(i, 1);
            }
        }
    }

    isColliding(obj1, obj2) {
        const distance = GameMath.getDistance(obj1.x, obj1.y, obj2.x, obj2.y);
        return distance < (obj1.radius + obj2.radius);
    }

    calculateXPRequirement(level) {
        if (level === 1) return 100;
        if (level === 2) return 250;

        let totalXP = 100 + 250;
        for (let i = 3; i <= level; i++) {
            totalXP += i * 150;
        }
        return totalXP;
    }

    gainExperience(amount) {
        this.currentXP += amount;
        this.totalXP += amount;

        while (this.currentXP >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.currentXP -= this.xpToNextLevel;
        this.playerLevel++;

        const nextLevelTotalXP = this.calculateXPRequirement(this.playerLevel);
        const currentLevelTotalXP = this.calculateXPRequirement(this.playerLevel - 1);
        this.xpToNextLevel = nextLevelTotalXP - currentLevelTotalXP;

        // console.log(`Level Up! Now level ${this.playerLevel}`);

        this.showLevelUpEffect();
        this.showSkillSelection();
    }

    showSkillSelection() {
        this.showingSkillSelection = true;
        this.isRunning = false;
        this.skillChoices = this.skillSystem.generateSkillChoices(3);

        this.displaySkillChoices();
        document.getElementById('skillSelection').style.display = 'block';
    }

    displaySkillChoices() {
        const container = document.getElementById('skillChoices');
        if (!container) {
            console.error('skillChoices container not found in HTML');
            return;
        }

        container.innerHTML = '';

        this.skillChoices.forEach((skillId, index) => {
            const skill = SKILL_CONFIG[skillId];
            if (!skill) return;

            const currentLevel = this.skillSystem.getSkillLevel(skillId);

            const button = document.createElement('button');
            button.className = 'skill-choice';
            button.innerHTML = `
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-name">${index + 1}. ${skill.name}</div>
                <div class="skill-level">Level ${currentLevel + 1}/${skill.maxLevel}</div>
                <div class="skill-type">${skill.type.toUpperCase()}</div>
                <div class="skill-description">${skill.description}</div>`;

            button.onclick = () => this.selectSkill(skillId);
            container.appendChild(button);
        });
    }

    selectSkill(skillId) {
        if (this.skillSystem.selectSkill(skillId, this.player)) {
            this.showingSkillSelection = false;
            this.isRunning = true;
            document.getElementById('skillSelection').style.display = 'none';
        }
    }

    selectSkillByIndex(index) {
        if (this.skillChoices && this.skillChoices[index]) {
            this.selectSkill(this.skillChoices[index]);
        }
    }

    showLevelUpEffect() {
        this.deathAnimations.push(new LevelUpEffect(this.player.x, this.player.y, this.playerLevel));
    }

    updateUI() {
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('score').textContent = this.score;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('level').textContent = this.playerLevel;
        document.getElementById('xp').textContent = this.currentXP;
        document.getElementById('xpNext').textContent = this.xpToNextLevel;
        document.getElementById('enemyCount').textContent = this.enemyCount;
    }

    restart() {
        this.startNewGame();
    }
}

window.SKILL_CONFIG = SKILL_CONFIG;
window.Fireball = Fireball;
window.Explosion = Explosion;
window.ChainLightning = ChainLightning;
window.IceSpike = IceSpike;
window.Meteor = Meteor;
window.MagicMissile = MagicMissile;
window.ArcingShock = ArcingShock;

export { Game };