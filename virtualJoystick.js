class VirtualJoystick {
    constructor(element) {
        this.element = element;
        this.knob = element.querySelector('.joystick-knob');
        this.isActive = false;
        this.centerX = 0;
        this.centerY = 0;
        this.maxDistance = 35;
        
        this.value = { x: 0, y: 0 };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.element.addEventListener('touchstart', this.onStart.bind(this), { passive: false });
        this.element.addEventListener('touchmove', this.onMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.onEnd.bind(this));
        
        this.element.addEventListener('mousedown', this.onStart.bind(this));
        this.element.addEventListener('mousemove', this.onMove.bind(this));
        this.element.addEventListener('mouseup', this.onEnd.bind(this));
        this.element.addEventListener('mouseleave', this.onEnd.bind(this));
    }
    
    onStart(e) {
        e.preventDefault();
        this.isActive = true;
        
        const rect = this.element.getBoundingClientRect();
        this.centerX = rect.left + rect.width / 2;
        this.centerY = rect.top + rect.height / 2;
        
        this.updatePosition(e);
    }
    
    onMove(e) {
        if (!this.isActive) return;
        e.preventDefault();
        this.updatePosition(e);
    }
    
    onEnd(e) {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.value = { x: 0, y: 0 };
        
        this.knob.style.transform = 'translate(-50%, -50%)';
    }
    
    updatePosition(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - this.centerX;
        const deltaY = clientY - this.centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance <= this.maxDistance) {
            this.knob.style.transform = `translate(${deltaX - 25}px, ${deltaY - 25}px)`;
            this.value.x = deltaX / this.maxDistance;
            this.value.y = deltaY / this.maxDistance;
        } else {
            const angle = Math.atan2(deltaY, deltaX);
            const limitedX = Math.cos(angle) * this.maxDistance;
            const limitedY = Math.sin(angle) * this.maxDistance;
            
            this.knob.style.transform = `translate(${limitedX - 25}px, ${limitedY - 25}px)`;
            this.value.x = Math.cos(angle);
            this.value.y = Math.sin(angle);
        }
    }
    
    getValue() {
        return this.value;
    }
}

export { VirtualJoystick };