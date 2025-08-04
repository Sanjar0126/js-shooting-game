import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { DeathAnimation, LevelUpEffect } from './animations.js';
import { FPSMeter } from './debug.js';
import { VirtualJoystick } from './virtualJoystick.js';

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

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.enemyBullets = [];

        this.worldWidth = 3000;
        this.worldHeight = 3000;

        this.camera = new Camera(this.width, this.height);
        this.deathAnimations = [];

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

        this.player = null;
        this.bullets = [];
        this.enemies = [];

        this.keys = {};
        this.mouse = { x: 0, y: 0, isPressed: false };

        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;

        this.fpsMeter = new FPSMeter();

        this.isMobile = this.detectMobile();
        this.movementJoystick = null;
        this.shootingJoystick = null;

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
        const movementElement = document.getElementById('movementJoystick');
        const shootingElement = document.getElementById('shootingJoystick');

        if (movementElement && shootingElement) {
            this.movementJoystick = new VirtualJoystick(movementElement);
            this.shootingJoystick = new VirtualJoystick(shootingElement);
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


        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];
        this.deathAnimations = [];

        this.playerLevel = 1;
        this.currentXP = 0;
        this.xpToNextLevel = 100;
        this.totalXP = 0;

        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;

        this.camera.x = 0;
        this.camera.y = 0;

        document.getElementById('mainMenu').style.display = 'none';
        document.getElementById('ui').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';

        this.showFPS = document.getElementById('fpsToggle').checked;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

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
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
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

        if (this.gameState === 'playing') {
            this.update(deltaTime);
        }

        this.render();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    handleMobileInput(deltaTime) {
        const moveValue = this.movementJoystick.getValue();

        this.keys['KeyW'] = moveValue.y < -0.3;
        this.keys['KeyS'] = moveValue.y > 0.3;
        this.keys['KeyA'] = moveValue.x < -0.3;
        this.keys['KeyD'] = moveValue.x > 0.3;
    }

    update(deltaTime) {
        if (this.isMobile && this.movementJoystick && this.shootingJoystick) {
            this.handleMobileInput(deltaTime);
        }

        this.player.update(deltaTime, this.keys);
        this.camera.update(this.player);

        if (this.isMobile && this.shootingJoystick) {
            const shootValue = this.shootingJoystick.getValue();
            if (Math.abs(shootValue.x) > 0.1 || Math.abs(shootValue.y) > 0.1) {
                const shootTargetX = this.player.x + shootValue.x * 100;
                const shootTargetY = this.player.y + shootValue.y * 100;

                const screenX = shootTargetX - this.camera.x;
                const screenY = shootTargetY - this.camera.y;

                this.player.shoot(screenX, screenY, this.bullets, this.camera);
            }
        } else if (!this.isMobile && this.mouse.isPressed) {
            this.player.shoot(this.mouse.x, this.mouse.y, this.bullets, this.camera);
        }

        // if (this.gameState === 'playing' && this.mouse.isPressed) {
        //     this.player.shoot(this.mouse.x, this.mouse.y, this.bullets, this.camera);
        // }

        this.player.x = Math.max(this.player.radius,
            Math.min(this.worldWidth - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius,
            Math.min(this.worldHeight - this.player.radius, this.player.y));

        this.waveTimer += deltaTime;
        if (this.waveTimer >= this.waveDuration) {
            this.nextWave();
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(deltaTime);
            if (this.bullets[i].isExpired()) {
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime, this.player, this.enemyBullets);
            if (this.enemies[i].health <= 0) {
                this.gainExperience(this.enemies[i].xpValue);
                this.score += this.enemies[i].scoreValue;

                this.deathAnimations.push(new DeathAnimation(this.enemies[i].x, this.enemies[i].y, 'enemy'));
                this.enemies.splice(i, 1);
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
        if (this.enemySpawnTimer > 500) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

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

    render() {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.gameState === 'playing') {
            this.drawGrid();
            this.player.render(this.ctx, this.camera);
            this.bullets.forEach(bullet => bullet.render(this.ctx, this.camera));
            this.enemies.forEach(enemy => enemy.render(this.ctx, this.camera));
            this.enemyBullets.forEach(bullet => bullet.render(this.ctx, this.camera));
            this.deathAnimations.forEach(animation => animation.render(this.ctx, this.camera));
            this.drawWorldBounds();
        } else if (this.gameState === 'menu') {
            this.drawMenuBackground();
        } else if (this.gameState === 'paused') {
            this.drawGrid();
            this.player.render(this.ctx, this.camera);
            this.bullets.forEach(bullet => bullet.render(this.ctx, this.camera));
            this.enemies.forEach(enemy => enemy.render(this.ctx, this.camera));
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

    drawGrid() {
        const gridSize = 100;
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;


        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;


        for (let x = startX; x < this.camera.x + this.width + gridSize; x += gridSize) {
            const screenX = x - this.camera.x;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.height);
            this.ctx.stroke();
        }


        for (let y = startY; y < this.camera.y + this.height + gridSize; y += gridSize) {
            const screenY = y - this.camera.y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.width, screenY);
            this.ctx.stroke();
        }
    }

    drawWorldBounds() {
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 3;

        const screenLeft = -this.camera.x;
        const screenTop = -this.camera.y;
        const screenRight = this.worldWidth - this.camera.x;
        const screenBottom = this.worldHeight - this.camera.y;

        this.ctx.strokeRect(screenLeft, screenTop, this.worldWidth, this.worldHeight);
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

        this.enemies.push(new Enemy(clampedX, clampedY, enemyType));
    }

    checkCollisions() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                if (this.isColliding(this.bullets[i], this.enemies[j])) {
                    this.enemies[j].takeDamage(this.bullets[i].damage);
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }

        this.enemies.forEach(enemy => {
            if (this.isColliding(this.player, enemy)) {
                this.player.takeDamage(enemy.damage);
                if (enemy.type !== 'exploder') {
                    enemy.health = 0;
                }
            }
        });

        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            if (this.isColliding(this.player, this.enemyBullets[i])) {
                this.player.takeDamage(this.enemyBullets[i].damage);
                this.enemyBullets.splice(i, 1);
            }
        }
    }

    isColliding(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
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

        console.log(`Level Up! Now level ${this.playerLevel}`);

        this.showLevelUpEffect();
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
    }

    restart() {
        this.startNewGame();
    }
}

export { Game };