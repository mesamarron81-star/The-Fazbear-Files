class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.active = false;
        this.masterGain = null;
        this.humOsc = null;
        this.humGain = null;
        this.noiseNode = null;
        this.noiseGain = null;
        this.fanNode = null;
        this.fanGain = null;
        this.flickerTimer = null;
    }

    async init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn('Audio not available');
            this.initialized = false;
        }
    }

    async start() {
        if (!this.initialized || this.active) return;

        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        this.active = true;
        this.startHum();
        this.startNoise();
        this.startFan();
    }

    stop() {
        this.active = false;
        this.stopHum();
        this.stopNoise();
        this.stopFan();
        if (this.flickerTimer) {
            clearInterval(this.flickerTimer);
            this.flickerTimer = null;
        }
    }

    startHum() {
        if (!this.ctx) return;
        this.humOsc = this.ctx.createOscillator();
        this.humGain = this.ctx.createGain();

        this.humOsc.type = 'sine';
        this.humOsc.frequency.value = 60;
        this.humGain.gain.value = 0.02;

        this.humOsc.connect(this.humGain);
        this.humGain.connect(this.masterGain);
        this.humOsc.start();

        const hum2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        hum2.type = 'sine';
        hum2.frequency.value = 120;
        gain2.gain.value = 0.008;
        hum2.connect(gain2);
        gain2.connect(this.masterGain);
        hum2.start();
    }

    stopHum() {
        if (this.humOsc) {
            this.humOsc.stop();
            this.humOsc.disconnect();
            this.humOsc = null;
        }
        if (this.humGain) {
            this.humGain.disconnect();
            this.humGain = null;
        }
    }

    startNoise() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        this.noiseNode = this.ctx.createBufferSource();
        this.noiseNode.buffer = buffer;
        this.noiseNode.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        this.noiseGain = this.ctx.createGain();
        this.noiseGain.gain.value = 0.01;

        this.noiseNode.connect(filter);
        filter.connect(this.noiseGain);
        this.noiseGain.connect(this.masterGain);
        this.noiseNode.start();
    }

    stopNoise() {
        if (this.noiseNode) {
            this.noiseNode.stop();
            this.noiseNode.disconnect();
            this.noiseNode = null;
        }
        if (this.noiseGain) {
            this.noiseGain.disconnect();
            this.noiseGain = null;
        }
    }

    startFan() {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 1;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.ctx.sampleRate;
            data[i] = (Math.random() * 2 - 1) * (0.3 + 0.7 * Math.sin(t * 4));
        }

        this.fanNode = this.ctx.createBufferSource();
        this.fanNode.buffer = buffer;
        this.fanNode.loop = true;

        const fanFilter = this.ctx.createBiquadFilter();
        fanFilter.type = 'bandpass';
        fanFilter.frequency.value = 400;
        fanFilter.Q.value = 0.5;

        this.fanGain = this.ctx.createGain();
        this.fanGain.gain.value = 0.015;

        this.fanNode.connect(fanFilter);
        fanFilter.connect(this.fanGain);
        this.fanGain.connect(this.masterGain);
        this.fanNode.start();
    }

    stopFan() {
        if (this.fanNode) {
            this.fanNode.stop();
            this.fanNode.disconnect();
            this.fanNode = null;
        }
        if (this.fanGain) {
            this.fanGain.disconnect();
            this.fanGain = null;
        }
    }

    playCameraSwitch() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);

        const noise = this.ctx.createBufferSource();
        const bufSize = this.ctx.sampleRate * 0.3;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
        noise.buffer = buf;
        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.02, this.ctx.currentTime);
        ng.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        noise.connect(ng);
        ng.connect(this.masterGain);
        noise.start();
    }

    playMotionAlert() {
        if (!this.ctx || !this.active) return;
        for (let i = 0; i < 2; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 1000 + i * 200;
            gain.gain.setValueAtTime(0.02, this.ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.15 + 0.1);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(this.ctx.currentTime + i * 0.15);
            osc.stop(this.ctx.currentTime + i * 0.15 + 0.1);
        }
    }

    playEntityDetected() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playSubliminal() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 2000;
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    playEyesGlow() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
    }

    playShadowMove() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    }

    playAudioGlitch() {
        if (!this.ctx || !this.active) return;
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 500 + Math.random() * 2000;
            gain.gain.setValueAtTime(0.02, this.ctx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.03);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(this.ctx.currentTime + i * 0.05);
            osc.stop(this.ctx.currentTime + i * 0.05 + 0.03);
        }
    }

    playJumpScare() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2000, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);

        const noise = this.ctx.createBufferSource();
        const bufSize = this.ctx.sampleRate * 0.3;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
        noise.buffer = buf;
        const ng = this.ctx.createGain();
        ng.gain.setValueAtTime(0.06, this.ctx.currentTime);
        ng.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        noise.connect(ng);
        ng.connect(this.masterGain);
        noise.start();
    }

    playFlicker() {
        if (!this.ctx || !this.active) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 100;
        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playBlackout() {
        if (!this.ctx || !this.active) return;
        this.stopHum();
        this.stopNoise();
        this.stopFan();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 2);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 2);
    }

    playPowerRestore() {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);

        setTimeout(() => {
            if (this.active) {
                this.startHum();
                this.startNoise();
                this.startFan();
            }
        }, 1000);
    }
}
