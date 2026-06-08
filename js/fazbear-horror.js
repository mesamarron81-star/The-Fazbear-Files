/* ═══════════════════════════════════════════════════════
   FAZBEAR HORROR ENGINE v3.0
   ═══════════════════════════════════════════════════════ */

(function() {
    'use strict';

    // ─── CONFIG ───
    const CONFIG = {
        glitchInterval: 7000,
        jumpscareChance: 0.04,
        subliminalChance: 0.03,
        audioChance: 0.06,
        easterEggInterval: 15000,
        powerFlickerInterval: 12000,
        maxJumpscaresPerSession: 3
    };

    let jumpscareCount = 0;
    let audioCtx = null;
    let isAudioInitialized = false;

    // ─── IMAGE POOL (from Fandom wikis) ───
    const IMAGES = {
        jumpscares: [
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/3/37/GoldenFreddy_-_Confe.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/9/9e/Unnamedd.png'
        ],
        subliminals: [
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/2/22/FandomCompass.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/e/e6/Site-logo.png'
        ],
        references: [
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/9/95/FiveNightsAtFreddys.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/e/ee/FNaF2_-_Portada.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/4/4d/FNaF3_-_Portada.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/2/28/FNaF4_-_Portada.jpg',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/5/51/Freddy_Fazbear%27s_pizzeria_simulator.jpg',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/e/ea/FNaFWorldLogo.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/c/c7/FNaFAR_-_Icon1.png',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/f/fe/UCN_-_Header.jpg',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/6/6a/Hw_%282%29_-_Scottgames.jpg',
            'https://static.wikia.nocookie.net/freddy-fazbears-pizza/images/9/95/FNaF_Security_Breach_%28Teaser%29.jpg'
        ]
    };

    // ─── SUBLIMINAL MESSAGES ───
    const SUBLIMINAL_MSGS = [
        'IT\'S ME', 'HELP ME', 'I AM STILL HERE', 'SAVE US',
        'WAS IT ME?', 'WAS IT YOU?', 'GOLDEN FREDDY', '1987',
        'DON\'T TRUST THEM', 'THEY\'RE INSIDE', 'YOU CAN\'T LEAVE',
        'FOREVER', 'YOUR MOVE', 'THE SHOW MUST GO ON',
        'ALL THOSE HOURS', 'I REMEMBER EVERYTHING', 'YOU\'RE NEXT',
        'WAKE UP', 'DREAM OR NIGHTMARE?', 'COUNT THE WAYS',
        'DEEPER AND DEEPER', 'NO ESCAPE', 'THE EYES WATCH',
        'BEHIND YOU', 'DOORS LOCKED', 'POWER LOW',
        'SYSTEM FAILURE', 'FILE CORRUPTED', 'RESTRICTED',
        'CLASSIFIED', 'UNAUTHORIZED ACCESS', 'DATA LOST',
        'HE DIED IN THERE', 'THE SPRINGLOCKS', 'TOGETHER FOREVER',
        'I PUT MYSELF BACK TOGETHER', 'THE PARTY WAS FOR YOU',
        'WE ARE STILL YOUR FRIENDS', 'DO YOU BELIEVE IN MAGIC?',
        'DON\'T HIDE', 'THE DARKNESS', 'YOUR AGONY',
        'REMEMBER WHAT YOU SAW', 'SOMETHING BROKEN', 'MISSING CHILDREN',
        'TOMORROW IS ANOTHER DAY', 'SLEEP TIGHT', 'FIVE NIGHTS'
    ];

    // ─── EASTER EGG CODES ───
    const EASTER_EGGS = {
        '87': 'THE BITE OF 87',
        '83': 'THE BITE OF 83',
        '1987': 'THE YEAR EVERYTHING CHANGED',
        'aidan': 'AIDAN — THE FIRST VICTIM',
        'purple': 'PURPLE GUY — WILLIAM AFTON',
        'springlock': 'SPRINGLOCK FAILURE — 1985',
        'golden': 'GOLDEN FREDDY — HE IS EVERYWHERE',
        'cassidy': 'CASSIDY — THE ONE YOU SHOULD NOT HAVE KILLED',
        'evan': 'EVAN — THE CRYING CHILD',
        'charlie': 'CHARLIE — THE PUPPET',
        'elizabeth': 'ELIZABETH — CIRCUS BABY',
        'michael': 'MICHAEL AFTON — THE UNDYING',
        'henry': 'HENRY EMILY — THE CREATOR',
        'vanessa': 'VANESSA — THE RELUCTANT FOLLOWER',
        'gregory': 'GREGORY — THE RUNAWAY',
        'glitchtrap': 'GLITCHTRAP — THE DIGITAL GHOST',
        'burntrap': 'BURNTRAP — THE REMNANT OF EVIL',
        'mimic': 'THE MIMIC — IT COPIES EVERYTHING',
        'pizzaplex': 'MEGA PIZZAPLEX — THE FUTURE OF ENTERTAINMENT',
        'fnaf': 'FIVE NIGHTS AT FREDDY\'S — THE NIGHTMARE BEGAN HERE',
        'cawthon': 'SCOTT CAWTHON — THE MASTERMIND',
        'nightmare': 'NIGHTMARE — YOUR WORST FEAR',
        'puppet': 'THE PUPPET — IT GIVES LIFE',
        'springtrap': 'SPRINGTRAP — HE CAME BACK',
        'afton': 'AFTON — THE FAMILY OF DEATH',
        'remnant': 'REMNANT — THE SOUL METAL',
        'agony': 'AGONY — THE DARK EMOTION',
        'shadow': 'SHADOW — THE DARK SIDE OF SOULS'
    };

    // ─── AUDIO SYSTEM (Web Audio API) ───
    function initAudio() {
        if (isAudioInitialized) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            isAudioInitialized = true;
            playAmbient();
        } catch(e) {}
    }

    function playTone(freq, duration, type, volume) {
        if (!audioCtx) return;
        try {
            var osc = audioCtx.createOscillator();
            var gain = audioCtx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            gain.gain.value = volume || 0.02;
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
    }

    function playNoise(duration, volume) {
        if (!audioCtx) return;
        try {
            var bufferSize = audioCtx.sampleRate * duration;
            var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            var data = buffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            var source = audioCtx.createBufferSource();
            source.buffer = buffer;
            var gain = audioCtx.createGain();
            gain.gain.value = volume || 0.03;
            source.connect(gain);
            gain.connect(audioCtx.destination);
            source.start();
        } catch(e) {}
    }

    var ambientInterval = null;
    function playAmbient() {
        if (ambientInterval) clearInterval(ambientInterval);
        playNoise(0.5, 0.01);
        ambientInterval = setInterval(function() {
            if (!audioCtx || Math.random() > 0.3) return;
            var choice = Math.random();
            if (choice < 0.33) {
                playTone(60, 2, 'sine', 0.01);
            } else if (choice < 0.66) {
                playTone(120, 0.5, 'square', 0.005);
            } else {
                playNoise(0.3, 0.015);
            }
        }, 15000);
    }

    // ─── JUMBSCARE ───
    function triggerJumpscare() {
        if (jumpscareCount >= CONFIG.maxJumpscaresPerSession) return;
        jumpscareCount++;

        var overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:#000;display:flex;align-items:center;justify-content:center;animation:glitch-flash 0.1s 3;pointer-events:none;';

        var img = document.createElement('img');
        img.src = IMAGES.jumpscares[Math.floor(Math.random() * IMAGES.jumpscares.length)];
        img.style.cssText = 'max-width:80vw;max-height:80vh;opacity:0.9;filter:contrast(1.3)brightness(0.8)saturate(0.3);';

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        // Scream-like noise
        playNoise(0.3, 0.08);
        playTone(200, 0.1, 'sawtooth', 0.05);
        playTone(400, 0.15, 'square', 0.03);

        setTimeout(function() { overlay.remove(); }, 400);

        // Flash effect
        var flash = document.createElement('div');
        flash.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(255,255,255,0.15);pointer-events:none;';
        document.body.appendChild(flash);
        setTimeout(function() { flash.remove(); }, 50);
    }

    // ─── SUBLIMINAL FLASH ───
    function triggerSubliminal() {
        var div = document.createElement('div');
        div.style.cssText = 'position:fixed;inset:0;z-index:99990;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);pointer-events:none;';

        var msg = SUBLIMINAL_MSGS[Math.floor(Math.random() * SUBLIMINAL_MSGS.length)];
        var text = document.createElement('div');
        text.style.cssText = 'font-family:\'Press Start 2P\',monospace;font-size:24px;color:var(--crt-green,#76FF76);text-shadow:0 0 30px rgba(118,255,118,0.3);letter-spacing:6px;text-align:center;animation:glitch-rgb 0.2s 3;';
        text.textContent = msg;

        var useImg = Math.random() < 0.3;
        if (useImg) {
            var img = document.createElement('img');
            img.src = IMAGES.subliminals[Math.floor(Math.random() * IMAGES.subliminals.length)];
            img.style.cssText = 'max-width:200px;opacity:0.3;filter:grayscale(1)contrast(2);position:absolute;bottom:20px;right:20px;';
            div.appendChild(img);
        }

        div.appendChild(text);
        document.body.appendChild(div);

        setTimeout(function() { div.remove(); }, 120);
    }

    // ─── GLITCH OVERLAY ───
    function triggerGlitch() {
        var g = document.createElement('div');
        g.style.cssText = 'position:fixed;inset:0;z-index:99985;pointer-events:none;';
        g.style.background = 'rgba(0,0,0,0.3)';
        g.style.transform = 'translateX(' + (Math.random() * 10 - 5) + 'px)';
        document.body.appendChild(g);
        setTimeout(function() {
            g.style.background = 'rgba(255,255,255,0.05)';
            g.style.transform = 'translateX(' + (Math.random() * 10 - 5) + 'px)';
        }, 50);
        setTimeout(function() {
            g.style.background = 'rgba(0,255,0,0.03)';
            g.style.transform = 'translateX(0)';
        }, 100);
        setTimeout(function() { g.remove(); }, 200);

        // RGB split on text
        var texts = document.querySelectorAll('h1, h2, h3, .glitch-text');
        texts.forEach(function(t) {
            if (Math.random() < 0.1) {
                var origShadow = t.style.textShadow;
                t.style.textShadow = '3px 0 rgba(255,0,0,0.3), -3px 0 rgba(0,255,255,0.3)';
                setTimeout(function() { t.style.textShadow = origShadow; }, 80);
            }
        });
    }

    // ─── POWER FLICKER ───
    function triggerFlicker() {
        var leds = document.querySelectorAll('.led');
        leds.forEach(function(led) {
            if (Math.random() < 0.4) {
                led.style.opacity = '0.1';
                setTimeout(function() {
                    led.style.opacity = '';
                    led.style.animation = 'none';
                    led.offsetHeight;
                    led.style.animation = '';
                }, 50 + Math.random() * 200);
            }
        });
    }

    // ─── EASTER EGG DETECTOR ───
    function checkEasterEggs() {
        var text = document.body.innerText.toLowerCase();
        var found = [];
        for (var key in EASTER_EGGS) {
            if (text.indexOf(key) > -1 && Math.random() < 0.05) {
                found.push(EASTER_EGGS[key]);
            }
        }
        if (found.length > 0 && Math.random() < 0.3) {
            var div = document.createElement('div');
            div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99980;font-family:\'Press Start 2P\',monospace;font-size:10px;color:var(--crt-green,#76FF76);text-shadow:0 0 20px rgba(118,255,118,0.5);background:rgba(0,0,0,0.9);border:1px solid var(--crt-green,#76FF76);padding:16px 24px;text-align:center;pointer-events:none;animation:glitch-rgb 0.3s 3;';
            div.textContent = found[Math.floor(Math.random() * found.length)];
            document.body.appendChild(div);
            setTimeout(function() { div.remove(); }, 1500);
        }
    }

    // ─── STATIC BURST ───
    function staticBurst() {
        var s = document.createElement('div');
        s.style.cssText = 'position:fixed;inset:0;z-index:99975;pointer-events:none;';
        s.style.background = 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px)';
        s.style.opacity = '0.3';
        document.body.appendChild(s);
        setTimeout(function() { s.style.opacity = '0.6'; }, 30);
        setTimeout(function() { s.style.opacity = '0.1'; }, 60);
        setTimeout(function() { s.style.opacity = '0.4'; }, 90);
        setTimeout(function() { s.remove(); }, 150);
    }

    // ─── VHS TRACKING ERROR ───
    function vhsTrackingError() {
        var t = document.createElement('div');
        var top = Math.random() * 80 + 5;
        var h = Math.random() * 15 + 3;
        t.style.cssText = 'position:fixed;top:' + top + '%;left:0;right:0;height:' + h + 'px;z-index:99970;background:rgba(0,0,0,0.3);pointer-events:none;';
        document.body.appendChild(t);

        var t2 = document.createElement('div');
        var top2 = top + h + Math.random() * 20 + 5;
        var h2 = Math.random() * 8 + 2;
        t2.style.cssText = 'position:fixed;top:' + top2 + '%;left:0;right:0;height:' + h2 + 'px;z-index:99970;background:rgba(0,0,0,0.2);pointer-events:none;';
        document.body.appendChild(t2);

        setTimeout(function() { t.remove(); t2.remove(); }, 150 + Math.random() * 200);
    }

    // ─── TIMER MANAGEMENT ───
    var startTime = Date.now();
    var lastEasterEgg = 0;
    var lastGlitch = 0;

    function mainLoop() {
        var elapsed = Math.floor((Date.now() - startTime) / 1000);

        // Glitch
        if (Math.random() < 0.06 + (elapsed > 120 ? 0.02 : 0)) {
            if (Math.random() < 0.03) {
                triggerJumpscare();
            } else if (Math.random() < 0.04) {
                triggerSubliminal();
            } else {
                triggerGlitch();
            }
        }

        // Static bursts
        if (Math.random() < 0.02) {
            staticBurst();
        }

        // VHS tracking
        if (Math.random() < 0.015) {
            vhsTrackingError();
        }

        // Power flicker
        if (Math.random() < 0.008) {
            triggerFlicker();
        }

        // Easter eggs
        if (Date.now() - lastEasterEgg > CONFIG.easterEggInterval && Math.random() < 0.2) {
            checkEasterEggs();
            lastEasterEgg = Date.now();
        }
    }

    // ─── KEYBOARD EASTER EGGS ───
    var keyBuffer = '';
    document.addEventListener('keydown', function(e) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 30) keyBuffer = keyBuffer.slice(-30);

        // Konami-like code
        var codes = ['1987', 'golden', 'purple', 'cassidy', 'afton', 'help', 'save'];
        for (var i = 0; i < codes.length; i++) {
            if (keyBuffer.indexOf(codes[i]) > -1) {
                keyBuffer = '';
                var msg = EASTER_EGGS[codes[i]] || 'SECRET DISCOVERED';
                var div = document.createElement('div');
                div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:100010;font-family:\'Press Start 2P\',monospace;font-size:12px;color:#ff0;text-shadow:0 0 30px rgba(255,255,0,0.5);background:rgba(0,0,0,0.95);border:2px solid #ff0;padding:20px 30px;text-align:center;';
                div.innerHTML = 'SECRET UNLOCKED<br><span style="font-size:8px;color:#ff0;opacity:0.7;">' + msg + '</span>';
                document.body.appendChild(div);
                setTimeout(function() { div.remove(); }, 3000);
                break;
            }
        }
    });

    // ─── INIT ───
    document.addEventListener('click', function() { initAudio(); }, {once: true});
    document.addEventListener('keydown', function() { initAudio(); }, {once: true});
    document.addEventListener('touchstart', function() { initAudio(); }, {once: true});

    setInterval(mainLoop, 2000);

    // Initial delay before first scares
    setTimeout(function() {
        // Mild start
    }, 30000);

    console.log('%c⚠ FAZBEAR HORROR ENGINE ACTIVE ⚠', 'font-size:20px;color:#ff0000;font-weight:bold;text-shadow:0 0 10px rgba(255,0,0,0.5);');
    console.log('%cTHE EYES ARE WATCHING', 'font-size:14px;color:#76FF76;');
})();
