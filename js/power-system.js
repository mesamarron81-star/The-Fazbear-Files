class PowerSystem {
    constructor() {
        this.maxPower = 100;
        this.currentPower = 100;
        this.drainRate = 0.008;
        this.active = false;
        this.powerBar = null;
        this.powerText = null;
        this.flickerInterval = null;
        this.tickInterval = null;
        this.lowPowerThreshold = 30;
        this.criticalPowerThreshold = 10;
        this.isBlackout = false;
        this.onBlackout = null;
        this.onPowerRestore = null;
        this.onLowPower = null;
        this.audioManager = null;
    }

    init(audioManager) {
        this.audioManager = audioManager;
        this.powerBar = document.getElementById('power-bar');
        this.powerText = document.getElementById('power-text');
    }

    start() {
        this.active = true;
        this.currentPower = this.maxPower;
        this.tick();
        this.startFlicker();
    }

    stop() {
        this.active = false;
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
        if (this.flickerInterval) {
            clearInterval(this.flickerInterval);
            this.flickerInterval = null;
        }
    }

    tick() {
        if (!this.active) return;

        this.currentPower = Math.max(0, this.currentPower - this.drainRate);
        this.updateUI();

        if (this.currentPower <= this.criticalPowerThreshold) {
            this.handleCritical();
        } else if (this.currentPower <= this.lowPowerThreshold) {
            this.handleLowPower();
        }

        if (this.currentPower <= 0) {
            this.handleBlackout();
            return;
        }

        this.tickInterval = setTimeout(() => this.tick(), 1000);
    }

    updateUI() {
        if (this.powerBar) {
            const pct = (this.currentPower / this.maxPower) * 100;
            this.powerBar.style.width = `${pct}%`;

            if (pct <= 10) {
                this.powerBar.style.background = 'var(--warning-red)';
                this.powerBar.style.boxShadow = '0 0 8px rgba(255,0,0,0.5)';
            } else if (pct <= 30) {
                this.powerBar.style.background = 'var(--crt-amber)';
                this.powerBar.style.boxShadow = '0 0 6px rgba(255,176,0,0.3)';
            } else {
                this.powerBar.style.background = 'var(--crt-green)';
                this.powerBar.style.boxShadow = '0 0 4px rgba(0,255,65,0.3)';
            }
        }

        if (this.powerText) {
            this.powerText.textContent = `${Math.round(this.currentPower)}%`;
        }
    }

    startFlicker() {
        this.flickerInterval = setInterval(() => {
            if (!this.active || this.isBlackout) return;
            if (this.currentPower < this.lowPowerThreshold && Math.random() < 0.3) {
                this.triggerFlicker();
            } else if (Math.random() < 0.05) {
                this.triggerFlicker();
            }
        }, 3000);
    }

    triggerFlicker() {
        const flickerEl = document.querySelector('.office-light-flicker');
        if (flickerEl) {
            flickerEl.classList.add('flicker');
            setTimeout(() => flickerEl.classList.remove('flicker'), 50 + Math.random() * 100);
        }

        const viewport = document.querySelector('.main-viewport');
        if (viewport && this.currentPower < this.lowPowerThreshold) {
            viewport.style.filter = 'brightness(0.5) saturate(0.5)';
            setTimeout(() => { viewport.style.filter = ''; }, 100 + Math.random() * 200);
        }

        if (this.audioManager && Math.random() < 0.5) {
            this.audioManager.playFlicker();
        }
    }

    handleLowPower() {
        if (this.onLowPower) {
            this.onLowPower();
        }
    }

    handleCritical() {
        document.querySelectorAll('.power-critical').forEach(el => {
            el.style.display = 'block';
        });
    }

    handleBlackout() {
        if (this.isBlackout) return;
        this.isBlackout = true;
        this.active = false;

        document.getElementById('blackout-overlay').classList.add('active');

        if (this.audioManager) {
            this.audioManager.playBlackout();
        }

        if (this.onBlackout) {
            setTimeout(() => this.onBlackout(), 1500);
        }
    }

    restorePower() {
        this.isBlackout = false;
        this.currentPower = 85;
        this.active = true;

        document.getElementById('blackout-overlay').classList.remove('active');

        if (this.audioManager) {
            this.audioManager.playPowerRestore();
        }

        if (this.onPowerRestore) {
            this.onPowerRestore();
        }

        this.updateUI();
        this.tick();
    }

    drain(amount) {
        this.currentPower = Math.max(0, this.currentPower - amount);
        this.updateUI();
        if (this.currentPower <= 0) {
            this.handleBlackout();
        }
    }

    getPercentage() {
        return (this.currentPower / this.maxPower) * 100;
    }
}
