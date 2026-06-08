class GlitchEngine {
    constructor() {
        this.active = false;
        this.intensity = 0.3;
        this.timer = null;
        this.minInterval = 15000;
        this.maxInterval = 45000;
        this.sessionTime = 0;
        this.crtEffects = null;
        this.vhsOverlay = null;
        this.entityDetector = null;
        this.callbacks = {
            onWhiteFlash: [],
            onRedFlash: [],
            onBlackout: [],
            onTextCorrupt: [],
            onSubliminal: [],
            onScreenCorrupt: [],
        };
    }

    init(crtEffects, vhsOverlay, entityDetector) {
        this.crtEffects = crtEffects;
        this.vhsOverlay = vhsOverlay;
        this.entityDetector = entityDetector;
    }

    start() {
        this.active = true;
        this.scheduleNext();
        this.startSessionTimer();
    }

    stop() {
        this.active = false;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        if (this.sessionInterval) {
            clearInterval(this.sessionInterval);
            this.sessionInterval = null;
        }
    }

    startSessionTimer() {
        this.sessionInterval = setInterval(() => {
            this.sessionTime += 1000;
            this.intensity = Math.min(1, 0.3 + this.sessionTime / 300000);
            this.minInterval = Math.max(5000, 15000 - this.sessionTime / 20);
            this.maxInterval = Math.max(10000, 45000 - this.sessionTime / 15);
        }, 1000);
    }

    scheduleNext() {
        if (!this.active) return;
        const delay = this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
        this.timer = setTimeout(() => {
            if (!this.active) return;
            this.triggerRandom();
            this.scheduleNext();
        }, delay);
    }

    triggerRandom() {
        const types = [
            'whiteFlash',
            'redFlash',
            'blackout',
            'textCorrupt',
            'subliminal',
            'screenCorrupt',
            'fragment',
            'invert',
            'interference',
            'entitySpawn',
        ];

        const weighted = [];
        const intenseTypes = ['subliminal', 'entitySpawn', 'redFlash'];
        types.forEach(t => {
            const count = intenseTypes.includes(t) ? Math.ceil(this.intensity * 2) : 1;
            for (let i = 0; i < count; i++) weighted.push(t);
        });

        const type = weighted[Math.floor(Math.random() * weighted.length)];
        this[type]();
    }

    whiteFlash() {
        const el = document.getElementById('white-flash');
        if (el) {
            el.style.opacity = '0.6';
            setTimeout(() => { el.style.opacity = '0'; }, 80 + Math.random() * 120);
        }
        this.callbacks.onWhiteFlash.forEach(cb => cb());
    }

    redFlash() {
        const el = document.getElementById('red-flash');
        if (el) {
            el.style.opacity = '0.5';
            setTimeout(() => { el.style.opacity = '0'; }, 100 + Math.random() * 200);
        }
        this.callbacks.onRedFlash.forEach(cb => cb());
    }

    blackout() {
        const el = document.getElementById('blackout-overlay');
        if (el) {
            el.classList.add('active');
            const duration = 100 + Math.random() * 200;
            setTimeout(() => el.classList.remove('active'), duration);
        }
        this.callbacks.onBlackout.forEach(cb => cb());
        if (this.crtEffects) {
            this.crtEffects.setInterference(0.8);
            setTimeout(() => this.crtEffects.setInterference(0), 300);
        }
    }

    textCorrupt() {
        const textEls = document.querySelectorAll('.glitch-text');
        textEls.forEach(el => {
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 300 + Math.random() * 400);
        });
        this.callbacks.onTextCorrupt.forEach(cb => cb());
    }

    subliminal() {
        const el = document.getElementById('subliminal-flash');
        if (el) {
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 100 + Math.random() * 150);
        }
        this.callbacks.onSubliminal.forEach(cb => cb());
        if (this.crtEffects) {
            this.crtEffects.flash();
        }
    }

    screenCorrupt() {
        const el = document.querySelector('.glitch-screen');
        if (el) {
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 400 + Math.random() * 200);
        }

        const mainViewport = document.querySelector('.main-viewport');
        if (mainViewport) {
            mainViewport.classList.add('corrupted');
            setTimeout(() => mainViewport.classList.remove('corrupted'), 500);
        }

        this.callbacks.onScreenCorrupt.forEach(cb => cb());
    }

    fragment() {
        const viewport = document.querySelector('.main-viewport');
        if (!viewport) return;

        for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
            const slice = document.createElement('div');
            slice.className = 'feed-glitch-slice';
            const top = Math.random() * 100;
            slice.style.top = `${top}%`;
            slice.style.height = `${5 + Math.random() * 15}px`;
            slice.style.background = `linear-gradient(90deg, transparent, rgba(255,255,255,${0.05 + Math.random() * 0.1}) 50%, transparent)`;
            slice.style.transform = `translateX(${(Math.random() - 0.5) * 20}px)`;
            viewport.appendChild(slice);
            setTimeout(() => slice.remove(), 200 + Math.random() * 300);
        }
    }

    invert() {
        const viewport = document.querySelector('.main-viewport');
        if (viewport) {
            viewport.style.filter = 'invert(1)';
            setTimeout(() => { viewport.style.filter = ''; }, 100 + Math.random() * 200);
        }
    }

    interference() {
        if (this.crtEffects) {
            this.crtEffects.setInterference(0.6 + Math.random() * 0.4);
            setTimeout(() => this.crtEffects.setInterference(0), 500 + Math.random() * 1000);
        }
        if (this.vhsOverlay) {
            this.vhsOverlay.triggerTracking();
        }
    }

    entitySpawn() {
        if (this.entityDetector && Math.random() < 0.6) {
            this.entityDetector.triggerSubliminal();
        } else {
            this.subliminal();
        }
    }

    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    triggerCustom(type) {
        if (this[type]) {
            this[type]();
        }
    }

    forceGlitch() {
        this.whiteFlash();
        this.screenCorrupt();
        this.interference();
        this.fragment();
        setTimeout(() => this.subliminal(), 200);
    }
}
