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