import { Player } from './player.js';
import { Enemy } from './enemy.js';

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

        this.isRunning = false;
        this.score = 0;
        this.wave = 1;

        this.player = null;
        this.bullets = [];
        this.enemies = [];


        this.keys = {};
        this.mouse = { x: 0, y: 0 };


        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
        this.start();
    }

    setupEventListeners() {

        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });


        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', (e) => {
            if (this.isRunning) {
                this.player.shoot(this.mouse.x, this.mouse.y, this.bullets, this.camera);
            }
        });
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.keys);

        this.camera.update(this.player);

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update(deltaTime);
            if (this.bullets[i].isExpired()) {
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime, this.player, this.enemyBullets);
            if (this.enemies[i].health <= 0) {
                this.score += this.enemies[i].scoreValue;
                this.enemies.splice(i, 1);
            }
        }

        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            this.enemyBullets[i].update(deltaTime);
            if (this.enemyBullets[i].isExpired()) {
                this.enemyBullets.splice(i, 1);
            }
        }

        this.enemySpawnTimer += deltaTime;
        if (this.enemySpawnTimer > 1000) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        this.checkCollisions();

        this.updateUI();

        if (this.player.health <= 0) {
            this.gameOver();
        }
    }

    render() {
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.drawGrid();

        this.player.render(this.ctx, this.camera);

        this.bullets.forEach(bullet => bullet.render(this.ctx, this.camera));
        this.enemies.forEach(enemy => enemy.render(this.ctx, this.camera));
        this.enemyBullets.forEach(bullet => bullet.render(this.ctx, this.camera));

        this.drawWorldBounds();
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


        if (this.camera.x < 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.camera.x, 0);
            this.ctx.lineTo(-this.camera.x, this.height);
            this.ctx.stroke();
        }


        if (this.camera.x + this.width > this.worldWidth - 50) {
            const screenX = this.worldWidth - this.camera.x;
            this.ctx.beginPath();
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.height);
            this.ctx.stroke();
        }


        if (this.camera.y < 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, -this.camera.y);
            this.ctx.lineTo(this.width, -this.camera.y);
            this.ctx.stroke();
        }


        if (this.camera.y + this.height > this.worldHeight - 50) {
            const screenY = this.worldHeight - this.camera.y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.width, screenY);
            this.ctx.stroke();
        }
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

    updateUI() {
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('score').textContent = this.score;
        document.getElementById('wave').textContent = this.wave;
    }

    gameOver() {
        this.isRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    restart() {

        this.score = 0;
        this.wave = 1;
        this.bullets = [];
        this.enemies = [];
        this.enemyBullets = [];

        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2);
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;

        this.camera.x = 0;
        this.camera.y = 0;

        document.getElementById('gameOver').style.display = 'none';

        this.start();
    }
}

export { Game };