const FazbearSystem = {
    crtEffects: null,
    vhsOverlay: null,
    glitchEngine: null,
    cameraSystem: null,
    powerSystem: null,
    entityDetector: null,
    audioManager: null,

    bootMessages: [
        { text: 'FAZBEAR ENTERTAINMENT INC.', delay: 300, cls: 'text-crt-green font-industrial' },
        { text: 'SECURITY MONITORING SYSTEM v2.7', delay: 200, cls: 'text-crt-green font-industrial' },
        { text: 'COPYRIGHT 1987 — ALL RIGHTS RESERVED', delay: 200, cls: 'text-dim font-industrial' },
        { text: '', delay: 150, cls: '' },
        { text: 'INITIALIZING HARDWARE...', delay: 400, cls: 'text-crt-green' },
        { text: 'LOADING CAMERA MODULES............ OK', delay: 600, cls: 'text-crt-green' },
        { text: 'CHECKING POWER SUPPLY............. WARNING', delay: 500, cls: 'text-warning' },
        { text: 'SCANNING NETWORK.................. 6/8 CAMERAS FOUND', delay: 700, cls: 'text-crt-amber' },
        { text: 'AUDIO SUBSYSTEM................... ERROR', delay: 400, cls: 'text-warning' },
        { text: 'MOTION DETECTION.................. ACTIVE', delay: 500, cls: 'text-crt-green' },
        { text: 'DOOR CONTROL...................... UNSTABLE', delay: 400, cls: 'text-crt-amber' },
        { text: 'VENTILATION....................... OFFLINE', delay: 300, cls: 'text-warning' },
        { text: '', delay: 200, cls: '' },
        { text: '████████████████████████  100%', delay: 800, cls: 'text-crt-green' },
        { text: '', delay: 150, cls: '' },
        { text: 'WARNING: UNAUTHORIZED ACCESS DETECTED', delay: 400, cls: 'text-warning glitch-text' },
        { text: 'MULTIPLE ENTITIES ACTIVE AFTER HOURS', delay: 500, cls: 'text-warning' },
        { text: 'POWER DRAIN EXCEEDS SAFE THRESHOLD', delay: 400, cls: 'text-crt-amber' },
        { text: '', delay: 200, cls: '' },
        { text: 'CONTINUE? Y/N [AUTOMATIC OVERRIDE IN: 5]', delay: 1000, cls: 'text-crt-green' },
        { text: 'CONTINUE? Y/N [AUTOMATIC OVERRIDE IN: 4]', delay: 1000, cls: 'text-crt-green' },
        { text: 'CONTINUE? Y/N [AUTOMATIC OVERRIDE IN: 3]', delay: 1000, cls: 'text-crt-green' },
        { text: 'CONTINUE? Y/N [AUTOMATIC OVERRIDE IN: 2]', delay: 1000, cls: 'text-crt-green' },
        { text: 'CONTINUE? Y/N [AUTOMATIC OVERRIDE IN: 1]', delay: 1000, cls: 'text-crt-green' },
        { text: 'INITIALIZING SYSTEM...', delay: 500, cls: 'text-crt-green' },
    ],

    async boot() {
        const bootScreen = document.getElementById('boot-screen');
        const bootText = document.getElementById('boot-text');
        const mainApp = document.getElementById('main-app');

        bootScreen.style.display = 'flex';
        mainApp.style.display = 'none';

        bootText.innerHTML = '';
        let index = 0;

        const typeNext = () => {
            if (index >= this.bootMessages.length) {
                this.completeBoot(bootScreen, mainApp);
                return;
            }

            const msg = this.bootMessages[index];
            const line = document.createElement('div');
            line.className = msg.cls || '';
            line.textContent = msg.text;
            line.style.cssText = `
                opacity: 0; margin-bottom: 2px;
                text-shadow: 0 0 2px currentColor;
                animation: flickerIn 0.3s ease-out forwards;
            `;
            bootText.appendChild(line);

            const scrollTimeout = msg.delay + 100;
            setTimeout(() => {
                bootText.scrollTop = bootText.scrollHeight;
            }, scrollTimeout);

            index++;
            setTimeout(typeNext, msg.delay + Math.random() * 100);
        };

        setTimeout(typeNext, 500);
    },

    completeBoot(bootScreen, mainApp) {
        const crtOverlay = document.querySelector('#crt-overlay');
        if (crtOverlay) crtOverlay.style.display = 'block';

        setTimeout(() => {
            bootScreen.style.opacity = '0';
            bootScreen.style.transition = 'opacity 0.5s';

            setTimeout(() => {
                bootScreen.style.display = 'none';
                mainApp.style.display = 'block';
                mainApp.classList.add('crt-turn-on');
                this.initializeSystem();
            }, 500);
        }, 300);
    },

    initializeSystem() {
        this.crtEffects = new CRTEffects();
        this.vhsOverlay = new VHSOverlay();
        this.glitchEngine = new GlitchEngine();
        this.cameraSystem = new CameraSystem();
        this.powerSystem = new PowerSystem();
        this.entityDetector = new EntityDetector();
        this.audioManager = new AudioManager();

        this.glitchEngine.init(this.crtEffects, this.vhsOverlay, this.entityDetector);
        this.cameraSystem.init(this.vhsOverlay, this.audioManager);
        this.powerSystem.init(this.audioManager);
        this.entityDetector.init(this.cameraSystem, this.glitchEngine, this.audioManager);
        this.vhsOverlay.start();

        this.setupEventHandlers();

        setTimeout(async () => {
            await this.audioManager.init();
            this.crtEffects.start();

            setTimeout(() => {
                this.audioManager.start();
                this.glitchEngine.start();
                this.entityDetector.start();
                this.powerSystem.start();
            }, 500);

            this.setupNightDisplay();
        }, 1500);
    },

    setupEventHandlers() {
        this.powerSystem.onBlackout = () => {
            this.handleBlackout();
        };

        this.powerSystem.onPowerRestore = () => {
            this.handlePowerRestore();
        };

        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '8' && this.cameraSystem) {
                this.cameraSystem.switchTo(parseInt(e.key));
            }
        });
    },

    setupNightDisplay() {
        const nightEl = document.getElementById('night-display');
        if (nightEl) {
            nightEl.textContent = `NIGHT ${1 + Math.floor(Math.random() * 5)}`;
        }
    },

    handleBlackout() {
        if (this.crtEffects) this.crtEffects.stop();
        if (this.vhsOverlay) this.vhsOverlay.signalLoss(2000);
        if (this.glitchEngine) this.glitchEngine.stop();
        if (this.entityDetector) this.entityDetector.stop();

        const mainViewport = document.querySelector('.main-viewport');
        if (mainViewport) {
            mainViewport.style.animation = 'powerDown 2s ease-out forwards';
        }

        setTimeout(() => {
            if (this.entityDetector && this.sessionTime > 120000) {
                this.entityDetector.jumpScare();
            }
        }, 3000);

        setTimeout(() => {
            if (this.powerSystem) {
                this.powerSystem.restorePower();
            }
        }, 5000 + Math.random() * 3000);
    },

    handlePowerRestore() {
        if (this.crtEffects) this.crtEffects.start();
        if (this.vhsOverlay) this.vhsOverlay.start();
        if (this.glitchEngine) this.glitchEngine.start();
        if (this.entityDetector) this.entityDetector.start();

        const mainViewport = document.querySelector('.main-viewport');
        if (mainViewport) {
            mainViewport.style.animation = 'powerUp 1.5s ease-out forwards';
            setTimeout(() => { mainViewport.style.animation = ''; }, 2000);
        }

        if (this.vhsOverlay) {
            this.vhsOverlay.staticBurst();
        }
    },

    async start() {
        await this.boot();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    FazbearSystem.start();
});
