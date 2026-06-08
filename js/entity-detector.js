class EntityDetector {
    constructor() {
        this.active = false;
        this.sessionTime = 0;
        this.lastEvent = 0;
        this.minInterval = 30000;
        this.maxInterval = 90000;
        this.timer = null;
        this.cameraSystem = null;
        this.glitchEngine = null;
        this.audioManager = null;
        this.callbacks = {
            onEntityDetected: [],
            onMotionDetected: [],
            onSubliminal: [],
            onJumpScare: [],
        };

        this.animatronicEyes = [
            { x: 20, y: 30, size: 40 },
            { x: 65, y: 25, size: 35 },
            { x: 80, y: 35, size: 30 },
            { x: 40, y: 50, size: 45 },
        ];
    }

    init(cameraSystem, glitchEngine, audioManager) {
        this.cameraSystem = cameraSystem;
        this.glitchEngine = glitchEngine;
        this.audioManager = audioManager;
    }

    start() {
        this.active = true;
        this.sessionTime = 0;
        this.lastEvent = Date.now();
        this.startSessionTimer();
        this.scheduleNext();
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
            this.minInterval = Math.max(15000, 30000 - this.sessionTime / 30);
            this.maxInterval = Math.max(30000, 90000 - this.sessionTime / 20);
        }, 1000);
    }

    scheduleNext() {
        if (!this.active) return;
        const delay = this.minInterval + Math.random() * (this.maxInterval - this.minInterval);
        this.timer = setTimeout(() => {
            if (!this.active) return;
            this.triggerEvent();
            this.scheduleNext();
        }, delay);
    }

    triggerEvent() {
        const types = [
            'motionDetected',
            'entityGlimpse',
            'subliminalFace',
            'eyesGlow',
            'cameraCorruption',
            'shadowMove',
            'audioGlitch',
            'jumpScare',
        ];

        const weighted = ['motionDetected', 'motionDetected', 'entityGlimpse', 'eyesGlow', 'cameraCorruption'];
        if (this.sessionTime > 60000) weighted.push('subliminalFace', 'shadowMove', 'audioGlitch');
        if (this.sessionTime > 120000) weighted.push('jumpScare');

        const type = weighted[Math.floor(Math.random() * weighted.length)];
        this[type]();
        this.lastEvent = Date.now();
    }

    motionDetected() {
        const cameraId = 1 + Math.floor(Math.random() * 8);
        const msg = `⚠ MOTION DETECTED — CAM ${String(cameraId).padStart(2, '0')}`;
        this.showAlert(msg, 'amber');

        if (this.cameraSystem) {
            this.cameraSystem.showMotion(cameraId);
        }

        if (this.audioManager) {
            this.audioManager.playMotionAlert();
        }

        this.callbacks.onMotionDetected.forEach(cb => cb(cameraId));
    }

    entityGlimpse() {
        const cameraId = [1, 3, 6, 8][Math.floor(Math.random() * 4)];
        const msg = `⚠ ENTITY DETECTED — CAM ${String(cameraId).padStart(2, '0')}`;
        this.showAlert(msg, 'red');

        if (this.cameraSystem) {
            this.cameraSystem.showMotion(cameraId);
        }

        if (this.glitchEngine) {
            this.glitchEngine.triggerCustom('screenCorrupt');
        }

        if (this.audioManager) {
            this.audioManager.playEntityDetected();
        }

        this.callbacks.onEntityDetected.forEach(cb => cb(cameraId));
    }

    subliminalFace() {
        const el = document.getElementById('subliminal-flash');
        if (el) {
            el.classList.add('active');
            const duration = 80 + Math.random() * 120;
            setTimeout(() => el.classList.remove('active'), duration);
        }

        if (this.glitchEngine) {
            this.glitchEngine.triggerCustom('whiteFlash');
        }

        if (this.audioManager) {
            this.audioManager.playSubliminal();
        }

        this.callbacks.onSubliminal.forEach(cb => cb());
    }

    eyesGlow() {
        const cameraId = this.cameraSystem ? this.cameraSystem.currentCamera : 1;
        const feed = document.querySelector('.main-viewport');

        if (feed) {
            const eyes = document.createElement('div');
            eyes.className = 'entity-eyes';
            eyes.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                z-index: 6; pointer-events: none;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; animation: entityAppear 2s ease-out forwards;
            `;
            eyes.innerHTML = `
                <div style="
                    width: 60px; height: 30px; display: flex; gap: 20px;
                    justify-content: center; align-items: center;
                ">
                    <div style="
                        width: 20px; height: 25px; background: radial-gradient(ellipse at center, 
                        rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.6) 40%, transparent 70%);
                        border-radius: 50%; box-shadow: 0 0 30px rgba(255,255,255,0.3);
                    "></div>
                    <div style="
                        width: 20px; height: 25px; background: radial-gradient(ellipse at center,
                        rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.6) 40%, transparent 70%);
                        border-radius: 50%; box-shadow: 0 0 30px rgba(255,255,255,0.3);
                    "></div>
                </div>
            `;
            feed.appendChild(eyes);
            setTimeout(() => eyes.remove(), 2500);
        }

        if (this.audioManager) {
            this.audioManager.playEyesGlow();
        }
    }

    cameraCorruption() {
        const cameraId = 1 + Math.floor(Math.random() * 8);
        const msg = `⚠ SIGNAL CORRUPTION — CAM ${String(cameraId).padStart(2, '0')}`;
        this.showAlert(msg, 'red');

        if (this.cameraSystem) {
            this.cameraSystem.triggerCameraCorruption(cameraId);
        }

        if (this.glitchEngine) {
            this.glitchEngine.triggerCustom('interference');
        }
    }

    shadowMove() {
        const cameraId = this.cameraSystem ? this.cameraSystem.currentCamera : 1;
        const msg = `⚠ UNAUTHORIZED MOVEMENT — CAM ${String(cameraId).padStart(2, '0')}`;
        this.showAlert(msg, 'amber');

        if (this.glitchEngine) {
            this.glitchEngine.triggerCustom('fragment');
        }

        if (this.audioManager) {
            this.audioManager.playShadowMove();
        }
    }

    audioGlitch() {
        const msg = '⚠ AUDIO ERROR — INTERFERENCE DETECTED';
        this.showAlert(msg, 'red');

        if (this.audioManager) {
            this.audioManager.playAudioGlitch();
        }
    }

    jumpScare() {
        if (this.sessionTime < 60000) return;

        const el = document.getElementById('subliminal-flash');
        if (el) {
            el.classList.add('active');
            el.style.animation = 'none';
            el.style.opacity = '1';
            setTimeout(() => {
                el.style.opacity = '0';
                el.classList.remove('active');
                el.style.animation = '';
            }, 150);
        }

        if (this.glitchEngine) {
            this.glitchEngine.triggerCustom('redFlash');
            this.glitchEngine.triggerCustom('screenCorrupt');
        }

        if (this.audioManager) {
            this.audioManager.playJumpScare();
        }

        const msg = '⚠ SYSTEM BREACH — SECURITY PROTOCOL FAILED';
        this.showAlert(msg, 'red', true);

        this.callbacks.onJumpScare.forEach(cb => cb());
    }

    triggerSubliminal() {
        this.subliminalFace();
    }

    showAlert(msg, type = 'red', persistent = false) {
        const container = document.getElementById('alert-container');
        if (!container) return;

        const alert = document.createElement('div');
        alert.className = `system-alert alert-${type}`;
        alert.textContent = msg;
        alert.style.cssText = `
            padding: 3px 8px; margin-bottom: 2px;
            font-family: var(--font-terminal); font-size: 13px;
            letter-spacing: 1px; border-left: 3px solid;
            animation: slideUp 0.3s ease-out;
            ${type === 'red' ? 'color: var(--warning-red); border-color: var(--warning-red);' :
              'color: var(--crt-amber); border-color: var(--crt-amber);'}
            background: rgba(0,0,0,0.6);
        `;

        container.appendChild(alert);

        if (!persistent) {
            setTimeout(() => {
                alert.style.opacity = '0';
                alert.style.transition = 'opacity 0.5s';
                setTimeout(() => alert.remove(), 500);
            }, 4000);
        }
    }

    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }
}
