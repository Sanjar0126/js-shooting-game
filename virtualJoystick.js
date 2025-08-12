class VirtualJoystick {
    constructor(container) {
        this.container = container;
        this.joystick = null;
        this.knob = null;
        this.isActive = false;
        this.value = { x: 0, y: 0 };

        this.centerX = 0;
        this.centerY = 0;
        this.maxDistance = 40;
        this.activePointerId = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.container.addEventListener('touchstart', (e) => this.onStart(e), { passive: false });
        this.container.addEventListener('touchmove', (e) => this.onMove(e), { passive: false });
        this.container.addEventListener('touchend', (e) => this.onEnd(e), { passive: false });
        this.container.addEventListener('touchcancel', (e) => this.onEnd(e), { passive: false });

        this.container.addEventListener('mousedown', (e) => this.onStart(e));
        document.addEventListener('mousemove', (e) => this.onMove(e));
        document.addEventListener('mouseup', (e) => this.onEnd(e));
    }

    createJoystick(x, y) {
        this.removeJoystick();

        this.joystick = document.createElement('div');
        this.joystick.className = 'dynamic-joystick';
        this.joystick.style.position = 'absolute';
        this.joystick.style.left = (x - 50) + 'px';
        this.joystick.style.top = (y - 50) + 'px';
        this.joystick.style.width = '100px';
        this.joystick.style.height = '100px';
        this.joystick.style.background = 'rgba(255, 255, 255, 0.1)';
        this.joystick.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        this.joystick.style.borderRadius = '50%';
        this.joystick.style.pointerEvents = 'none';
        this.joystick.style.zIndex = '1001';

        this.knob = document.createElement('div');
        this.knob.className = 'dynamic-joystick-knob';
        this.knob.style.position = 'absolute';
        this.knob.style.width = '40px';
        this.knob.style.height = '40px';
        this.knob.style.background = 'rgba(255, 255, 255, 0.8)';
        this.knob.style.borderRadius = '50%';
        this.knob.style.top = '50%';
        this.knob.style.left = '50%';
        this.knob.style.transform = 'translate(-50%, -50%)';
        this.knob.style.pointerEvents = 'none';

        this.joystick.appendChild(this.knob);
        this.container.appendChild(this.joystick);

        this.centerX = x;
        this.centerY = y;
    }

    removeJoystick() {
        if (this.joystick) {
            this.container.removeChild(this.joystick);
            this.joystick = null;
            this.knob = null;
        }
    }

    onStart(e) {
        if (!window.game || window.game.gameState !== 'playing' || window.game.showingSkillSelection) {
            return;
        }

        e.preventDefault();

        let clientX, clientY, pointerId;

        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            pointerId = e.touches[0].identifier;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
            pointerId = 'mouse';
        }

        const containerRect = this.container.getBoundingClientRect();
        const relativeY = clientY - containerRect.top;
        const containerHeight = containerRect.height;

        if (relativeY > containerHeight * 0.5) {
            this.isActive = true;
            this.activePointerId = pointerId;

            const relativeX = clientX - containerRect.left;
            this.createJoystick(relativeX, relativeY);
        }
    }

    onMove(e) {
        if (!this.isActive || !this.joystick) return;

        e.preventDefault();

        let clientX, clientY, pointerId;
        let found = false;

        if (e.touches) {
            for (let touch of e.touches) {
                if (touch.identifier === this.activePointerId) {
                    clientX = touch.clientX;
                    clientY = touch.clientY;
                    pointerId = touch.identifier;
                    found = true;
                    break;
                }
            }
        } else if (this.activePointerId === 'mouse') {
            clientX = e.clientX;
            clientY = e.clientY;
            found = true;
        }

        if (!found) return;

        const containerRect = this.container.getBoundingClientRect();
        const x = clientX - containerRect.left - this.centerX;
        const y = clientY - containerRect.top - this.centerY;

        const distance = Math.sqrt(x * x + y * y);

        if (distance <= this.maxDistance) {
            this.value.x = x / this.maxDistance;
            this.value.y = y / this.maxDistance;
            this.knob.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        } else {
            const angle = Math.atan2(y, x);
            const limitedX = Math.cos(angle) * this.maxDistance;
            const limitedY = Math.sin(angle) * this.maxDistance;

            this.value.x = limitedX / this.maxDistance;
            this.value.y = limitedY / this.maxDistance;
            this.knob.style.transform = `translate(-50%, -50%) translate(${limitedX}px, ${limitedY}px)`;
        }
    }

    onEnd(e) {
        if (!this.isActive) return;

        let shouldEnd = false;

        if (e.touches) {
            let stillActive = false;
            for (let touch of e.touches) {
                if (touch.identifier === this.activePointerId) {
                    stillActive = true;
                    break;
                }
            }
            shouldEnd = !stillActive;
        } else if (this.activePointerId === 'mouse') {
            shouldEnd = true;
        }

        if (shouldEnd) {
            e.preventDefault();
            this.isActive = false;
            this.activePointerId = null;
            this.value.x = 0;
            this.value.y = 0;
            this.removeJoystick();
        }
    }

    getValue() {
        return this.value;
    }
}

export { VirtualJoystick };