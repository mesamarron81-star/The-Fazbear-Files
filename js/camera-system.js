class CameraSystem {
    constructor() {
        this.cameras = [
            { id: 1, name: 'SHOW STAGE', image: 'assets/images/show_stage.png', online: true, audio: false },
            { id: 2, name: 'DINING AREA', image: 'assets/images/dining_area.png', online: true, audio: false },
            { id: 3, name: 'BACKSTAGE', image: 'assets/images/backstage_room.png', online: true, audio: false },
            { id: 4, name: 'WEST HALL', image: 'assets/images/dark_hallway.png', online: true, audio: false },
            { id: 5, name: 'EAST HALL', image: 'assets/images/dark_hallway.png', online: true, audio: false },
            { id: 6, name: 'PARTS & SERVICE', image: 'assets/images/parts_service.png', online: true, audio: false },
            { id: 7, name: 'KITCHEN', image: null, online: false, audio: true },
            { id: 8, name: 'SUPPLY CLOSET', image: 'assets/images/dark_hallway.png', online: true, audio: false },
        ];

        this.currentCamera = 1;
        this.previousCamera = 1;
        this.transitioning = false;
        this.switchCooldown = false;
        this.mainViewport = null;
        this.mainLabel = null;
        this.mainTimestamp = null;
        this.mainStatus = null;
        this.mainMotion = null;
        this.mainNoise = null;
        this.mainImage = null;
        this.cameraSelectors = [];
        this.mapButtons = [];
        this.gridFeeds = [];
        this.vhsOverlay = null;
        this.audioManager = null;
    }

    init(vhsOverlay, audioManager) {
        this.vhsOverlay = vhsOverlay;
        this.audioManager = audioManager;
        this.mainViewport = document.querySelector('.main-viewport');
        this.mainImage = this.mainViewport.querySelector('.viewport-image');
        this.mainLabel = this.mainViewport.querySelector('.viewport-label');
        this.mainTimestamp = this.mainViewport.querySelector('.viewport-timestamp');
        this.mainStatus = this.mainViewport.querySelector('.viewport-status');
        this.mainMotion = this.mainViewport.querySelector('.viewport-motion');
        this.mainNoise = this.mainViewport.querySelector('.viewport-noise');

        this.cameraSelectors = document.querySelectorAll('.camera-select-btn');
        this.mapButtons = document.querySelectorAll('.camera-map-btn');

        this.bindEvents();
        this.switchTo(1, true);
        this.updateTimestamp();
    }

    bindEvents() {
        this.cameraSelectors.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.camera);
                if (id && !this.transitioning) this.switchTo(id);
            });
        });

        this.mapButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.camera);
                if (id && !this.transitioning) this.switchTo(id);
            });
        });
    }

    switchTo(id, instant = false) {
        if (this.transitioning && !instant) return;
        if (id === this.currentCamera && !instant) return;

        const cam = this.cameras.find(c => c.id === id);
        if (!cam) return;

        this.previousCamera = this.currentCamera;
        this.currentCamera = id;
        this.transitioning = true;

        if (!instant) {
            this.playTransition();

            setTimeout(() => {
                this.displayCamera(cam);
                this.transitioning = false;
            }, 300 + Math.random() * 300);
        } else {
            this.displayCamera(cam);
            this.transitioning = false;
        }

        this.updateUI();
    }

    playTransition() {
        if (this.vhsOverlay) {
            this.vhsOverlay.staticBurst();
        }

        if (this.audioManager) {
            this.audioManager.playCameraSwitch();
        }

        if (this.mainImage) {
            this.mainImage.style.opacity = '0';
        }

        const staticOverlay = this.mainViewport.querySelector('.feed-static');
        if (staticOverlay) {
            staticOverlay.classList.add('active');
        }
    }

    displayCamera(cam) {
        if (!this.mainImage) return;

        this.mainLabel.textContent = `CAM ${String(cam.id).padStart(2, '0')} — ${cam.name}`;

        if (cam.online && cam.image) {
            this.mainImage.src = cam.image;
            this.mainImage.style.display = 'block';
            this.mainStatus.textContent = 'SIGNAL ACTIVE';
            this.mainStatus.className = 'viewport-status';
            this.mainStatus.style.color = 'var(--crt-green)';

            setTimeout(() => {
                this.mainImage.style.opacity = '0.7';
            }, 50);
        } else if (cam.audio && !cam.image) {
            this.mainImage.style.display = 'none';
            this.mainStatus.textContent = 'AUDIO ONLY';
            this.mainStatus.className = 'viewport-status';
            this.mainStatus.style.color = 'var(--crt-amber)';
        } else {
            this.mainImage.style.display = 'none';
            this.mainStatus.textContent = 'SIGNAL LOST';
            this.mainStatus.className = 'viewport-status offline';
            this.mainStatus.style.color = 'var(--warning-red)';
        }

        const staticOverlay = this.mainViewport.querySelector('.feed-static');
        if (staticOverlay) {
            staticOverlay.classList.remove('active');
        }

        this.mainMotion.classList.remove('active');
    }

    updateUI() {
        this.cameraSelectors.forEach(btn => {
            const id = parseInt(btn.dataset.camera);
            btn.classList.toggle('active', id === this.currentCamera);
        });

        this.mapButtons.forEach(btn => {
            const id = parseInt(btn.dataset.camera);
            btn.classList.toggle('active', id === this.currentCamera);
        });
    }

    updateTimestamp() {
        if (this.mainTimestamp) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            this.mainTimestamp.textContent = `REC ● 06-15-1987 ${timeStr}`;
        }
        setTimeout(() => this.updateTimestamp(), 1000);
    }

    getCurrentCamera() {
        return this.cameras.find(c => c.id === this.currentCamera);
    }

    getCamera(id) {
        return this.cameras.find(c => c.id === id);
    }

    showMotion(id) {
        const cam = this.cameras.find(c => c.id === id);
        if (!cam) return;

        if (id === this.currentCamera) {
            this.mainMotion.textContent = '⚠ MOTION DETECTED';
            this.mainMotion.classList.add('active');
        }

        const mapBtn = document.querySelector(`.camera-map-btn[data-camera="${id}"]`);
        if (mapBtn) {
            mapBtn.classList.add('has-entity');
        }

        setTimeout(() => {
            if (id === this.currentCamera) {
                this.mainMotion.classList.remove('active');
            }
            if (mapBtn) {
                mapBtn.classList.remove('has-entity');
            }
        }, 4000);
    }

    triggerCameraCorruption(id) {
        const cam = this.cameras.find(c => c.id === id);
        if (!cam) return;

        if (id === this.currentCamera) {
            const feed = this.mainViewport;
            feed.classList.add('corrupted');
            setTimeout(() => feed.classList.remove('corrupted'), 500 + Math.random() * 500);
        }
    }

    setCameraOffline(id) {
        const cam = this.cameras.find(c => c.id === id);
        if (!cam) return;
        cam.online = false;

        if (id === this.currentCamera) {
            this.displayCamera(cam);
        }

        const mapBtn = document.querySelector(`.camera-map-btn[data-camera="${id}"]`);
        if (mapBtn) mapBtn.classList.add('offline');

        const selBtn = document.querySelector(`.camera-select-btn[data-camera="${id}"]`);
        if (selBtn) selBtn.classList.add('offline');
    }

    setCameraOnline(id) {
        const cam = this.cameras.find(c => c.id === id);
        if (!cam) return;
        cam.online = true;

        if (id === this.currentCamera) {
            this.displayCamera(cam);
        }

        const mapBtn = document.querySelector(`.camera-map-btn[data-camera="${id}"]`);
        if (mapBtn) mapBtn.classList.remove('offline');

        const selBtn = document.querySelector(`.camera-select-btn[data-camera="${id}"]`);
        if (selBtn) selBtn.classList.remove('offline');
    }
}
