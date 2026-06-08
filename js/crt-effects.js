class CRTEffects {
    constructor() {
        this.canvas = document.getElementById('crt-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hue = 120;
        this.brightness = 1.0;
        this.scanlineOpacity = 0.08;
        this.noiseOpacity = 0.04;
        this.interferenceIntensity = 0;
        this.ghostOffset = 0;
        this.syncBarPosition = -10;
        this.frame = 0;
        this.active = false;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.active = true;
        this.render();
    }

    stop() {
        this.active = false;
    }

    setInterference(level) {
        this.interferenceIntensity = Math.max(0, Math.min(1, level));
    }

    setGhost(offset) {
        this.ghostOffset = offset;
    }

    render() {
        if (!this.active) return;
        this.frame++;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);

        this.drawNoise(ctx, w, h);
        this.drawScanlines(ctx, w, h);
        this.drawGhosting(ctx, w, h);
        this.drawInterference(ctx, w, h);
        this.drawSyncBar(ctx, w, h);

        requestAnimationFrame(() => this.render());
    }

    drawScanlines(ctx, w, h) {
        ctx.fillStyle = `rgba(0, 0, 0, ${this.scanlineOpacity})`;
        for (let y = 0; y < h; y += 3) {
            ctx.fillRect(0, y, w, 1);
        }
    }

    drawNoise(ctx, w, h) {
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        const noise = this.noiseOpacity * this.brightness;

        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255 * noise;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    drawGhosting(ctx, w, h) {
        if (this.ghostOffset === 0) return;
        ctx.fillStyle = `rgba(0, 255, 65, ${0.02 * this.ghostOffset})`;
        ctx.fillRect(-this.ghostOffset * 2, 0, w, h);
        ctx.fillStyle = `rgba(255, 0, 0, ${0.01 * this.ghostOffset})`;
        ctx.fillRect(this.ghostOffset, 0, w, h);
    }

    drawInterference(ctx, w, h) {
        if (this.interferenceIntensity === 0) return;
        const bands = Math.floor(3 + this.interferenceIntensity * 10);
        for (let i = 0; i < bands; i++) {
            const y = Math.random() * h;
            const height = 1 + Math.random() * 4 * this.interferenceIntensity;
            const opacity = 0.1 * this.interferenceIntensity;
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fillRect(0, y, w, height);
        }
    }

    drawSyncBar(ctx, w, h) {
        this.syncBarPosition += 0.5;
        if (this.syncBarPosition > h + 5) {
            this.syncBarPosition = -5;
        }
        const gradient = ctx.createLinearGradient(0, this.syncBarPosition, 0, this.syncBarPosition + 5);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, this.syncBarPosition, w, 5);
    }

    flash() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(0, 0, w, h);
        setTimeout(() => {
            ctx.clearRect(0, 0, w, h);
        }, 50);
    }

    distortVertical(intensity) {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const sliceHeight = 2 + Math.floor(Math.random() * 10 * intensity);
        const startY = Math.floor(Math.random() * (h - sliceHeight));

        for (let y = startY; y < startY + sliceHeight && y < h; y++) {
            for (let x = 0; x < w; x++) {
                const idx = (y * w + x) * 4;
                const offset = Math.sin((y - startY) * 0.5) * 5 * intensity;
                const srcX = Math.round(x + offset);
                if (srcX >= 0 && srcX < w) {
                    const srcIdx = (y * w + srcX) * 4;
                    data[idx] = data[srcIdx];
                    data[idx + 1] = data[srcIdx + 1];
                    data[idx + 2] = data[srcIdx + 2];
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
}
