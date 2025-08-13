import { ProjectileFactory } from './projectile.js';

export class ObjectPool {
    constructor(createFn, resetFn, initialSize = 50) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
        this.size = initialSize

        for (let i = 0; i < this.size; i++) {
            this.pool.push(createFn());
        }
    }

    get() {
        const obj = this.pool.length > 0 ? this.pool.pop() : this.createFn();
        this.active.push(obj);

        if (this.active.length >= this.size) {
            this.increasePoolSize();
        }

        return obj;
    }

    release(obj) {
        const index = this.active.indexOf(obj);
        if (index >= 0) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }

    increasePoolSize() {
        const addSize = Math.floor(this.size * 0.5);
        this.size += addSize;
        for (let i = 0; i < addSize; i++) {
            this.pool.push(this.createFn());
        }
        console.log(`ObjectPool: Increased pool size by ${addSize}. New size: ${this.size}`);
    }

    get objects() {
        return this.active;
    }

    countObjects() {
        return this.active.length;
    }
}

export class ProjectilePool {
    constructor() {
        this.pools = {};

        ProjectileFactory.getTypes().forEach(type => {
            this.pools[type] = new ObjectPool(
                () => ProjectileFactory.create(type),
                (projectile) => projectile.reset(),
                20
            );
        });
    }

    get(type, ...args) {
        const pool = this.pools[type];
        if (!pool) {
            console.error(`Unknown projectile type: ${type}`);
            return null;
        }

        const projectile = pool.get();
        projectile.init(...args);

        return projectile;
    }

    release(projectile) {
        const pool = this.pools[projectile.type];
        if (pool) {
            pool.release(projectile);
        }
    }

    getAllActive() {
        const allActive = [];
        Object.values(this.pools).forEach(pool => {
            allActive.push(...pool.active.filter(p => p.isActive));
        });
        return allActive;
    }

    clear() {
        Object.values(this.pools).forEach(pool => {
            const active = [...pool.active];
            active.forEach(projectile => pool.release(projectile));
        });
    }

    get projectiles() {
        return this.getAllActive();
    }
}