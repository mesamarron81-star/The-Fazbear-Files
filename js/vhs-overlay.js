class VHSOverlay {
    constructor() {
        this.canvas = document.getElementById('vhs-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.frame = 0;
        this.active = false;
        this.trackingActive = false;
        this.colorBleedActive = false;
        this.tapeDamageActive = false;
        this.staticBurstActive = false;
        this.trackingBars = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.updateTimestamp();
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

    updateTimestamp() {
        const el = document.querySelector('.vhs-timestamp');
        if (el) {
            const now = new Date();
            const dateStr = '06-15-1987';
            const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
            el.innerHTML = `<span class="rec-dot"></span> REC ● ${dateStr} ${timeStr}`;
        }
        setTimeout(() => this.updateTimestamp(), 30000);
    }

    render() {
        if (!this.active) return;
        this.frame++;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, w, h);

        if (this.trackingActive) {
            this.drawTracking(ctx, w, h);
        }

        if (this.colorBleedActive) {
            this.drawColorBleed(ctx, w, h);
        }

        if (this.tapeDamageActive) {
            this.drawTapeDamage(ctx, w, h);
        }

        this.drawVHSNoise(ctx, w, h);

        requestAnimationFrame(() => this.render());
    }

    drawTracking(ctx, w, h) {
        for (let i = 0; i < 3; i++) {
            const y = (this.frame * (2 + i * 1.5) + i * 50) % (h + 20) - 10;
            const h2 = 2 + Math.sin(this.frame * 0.02 + i) * 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.04 + Math.sin(this.frame * 0.05 + i) * 0.02})`;
            ctx.fillRect(0, y, w, h2);
        }
    }

    drawColorBleed(ctx, w, h) {
        if (Math.random() > 0.05) return;
        const offset = (Math.random() - 0.5) * 8;
        ctx.fillStyle = `rgba(255, 0, 0, 0.04)`;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = `rgba(0, 255, 255, 0.03)`;
        ctx.fillRect(offset, 0, w, h);
    }

    drawTapeDamage(ctx, w, h) {
        if (this.frame % 180 !== 0) return;
        const y = Math.random() * h;
        const damageH = 2 + Math.random() * 3;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.random() * 0.05})`;
        ctx.fillRect(0, y, w, damageH);
    }

    drawVHSNoise(ctx, w, h) {
        for (let i = 0; i < 5; i++) {
            if (Math.random() > 0.3) continue;
            const x = Math.random() * w;
            const y = Math.random() * h;
            const bw = 10 + Math.random() * 40;
            const bh = 1 + Math.random() * 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.01 + Math.random() * 0.02})`;
            ctx.fillRect(x, y, bw, bh);
        }
    }

    staticBurst() {
        const el = document.querySelector('.static-burst');
        if (el) {
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), 500);
        }
    }

    signalLoss(duration = 2000) {
        const el = document.getElementById('signal-loss');
        if (el) {
            el.classList.add('active');
            setTimeout(() => el.classList.remove('active'), duration);
        }
    }

    triggerTracking() {
        this.trackingActive = true;
        setTimeout(() => { this.trackingActive = false; }, 2000 + Math.random() * 3000);
    }

    triggerColorBleed() {
        this.colorBleedActive = true;
        setTimeout(() => { this.colorBleedActive = false; }, 1000 + Math.random() * 2000);
    }

    triggerTapeDamage() {
        this.tapeDamageActive = true;
        setTimeout(() => { this.tapeDamageActive = false; }, 500 + Math.random() * 1500);
    }
}
