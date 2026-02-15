/* ═══════════════════════════════════════════════════════════
   VALENTINE'S DAY — SCRIPT  (page-transition version)
   Pure vanilla JS — no frameworks / libraries
   ═══════════════════════════════════════════════════════════ */

// ── DOM ─────────────────────────────────────────────────
const pageHero = document.getElementById('pageHero');
const pageFlower = document.getElementById('pageFlower');
const pageMessage = document.getElementById('pageMessage');
const pages = [pageHero, pageFlower, pageMessage];

const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const heartBurst = document.getElementById('heartBurst');
const glowFlash = document.getElementById('glowFlash');

const bloom = document.getElementById('bloom');
const bloomAgain = document.getElementById('bloomAgain');
const btnNext = document.getElementById('btnNext');
const flowerCaption = document.getElementById('flowerCaption');

const typewriterEl = document.getElementById('typewriterText');
const msgSignature = document.getElementById('msgSignature');
const btnRestart = document.getElementById('btnRestart');

const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');

const heroParticles = document.getElementById('heroParticles');
const flowerParticles = document.getElementById('flowerParticles');
const messageParticles = document.getElementById('messageParticles');
const floatingHearts = document.getElementById('floatingHearts');
const dots = document.querySelectorAll('.dot');

// ── CONFIG ──────────────────────────────────────────────
const LOVE_MESSAGE = 'You make my world brighter every single day.';
let musicPlaying = false;
let currentPage = 0;
let heartsInterval = null;

/* ═══════════════════════════════════════════════════════
   PAGE NAVIGATION
   ═══════════════════════════════════════════════════════ */

/**
 * Switch to a target page by index (0 = hero, 1 = flower, 2 = message).
 * All other pages fade out; target fades in.
 */
function goToPage(index) {
    pages.forEach((p, i) => {
        p.classList.toggle('page--active', i === index);
    });
    dots.forEach((d, i) => {
        d.classList.toggle('dot--active', i === index);
    });
    currentPage = index;
}

/* ═══════════════════════════════════════════════════════
   1. AMBIENT PARTICLES (spawns for any container)
   ═══════════════════════════════════════════════════════ */

function spawnParticles(container, count = 30, colors) {
    container.innerHTML = '';
    const palette = colors || ['rgba(255,194,209,.45)', 'rgba(255,215,0,.3)'];
    for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        d.classList.add('glow-dot');
        const s = Math.random() * 3.5 + 1.5;
        d.style.width = d.style.height = `${s}px`;
        d.style.left = `${Math.random() * 100}%`;
        d.style.top = `${Math.random() * 100}%`;
        d.style.animationDuration = `${Math.random() * 7 + 5}s`;
        d.style.animationDelay = `${Math.random() * 5}s`;
        d.style.background = palette[Math.floor(Math.random() * palette.length)];
        container.appendChild(d);
    }
}

// start particles on hero immediately
spawnParticles(heroParticles, 35);

/* ═══════════════════════════════════════════════════════
   2. "NO" BUTTON — DODGE
   ═══════════════════════════════════════════════════════ */

let dodgeCount = 0;
const dodgeTexts = [
    '😢 No', '🥺 Sure?', '😭 Really?',
    '💔 Think again!', '😿 Please?',
    '🫠 Last chance…', '🥹 Why…'
];

function dodgeNo() {
    dodgeCount++;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const bw = btnNo.offsetWidth;
    const bh = btnNo.offsetHeight;
    const x = Math.random() * (vw - bw - 40) + 20;
    const y = Math.random() * (vh - bh - 40) + 20;

    if (!btnNo.classList.contains('dodging')) btnNo.classList.add('dodging');
    btnNo.style.left = `${x}px`;
    btnNo.style.top = `${y}px`;
    btnNo.textContent = dodgeTexts[Math.min(dodgeCount - 1, dodgeTexts.length - 1)];
}

btnNo.addEventListener('mouseenter', dodgeNo);
btnNo.addEventListener('touchstart', e => { e.preventDefault(); dodgeNo(); }, { passive: false });

/* ═══════════════════════════════════════════════════════
   3. "YES" — HEART BURST → GO TO FLOWER PAGE
   ═══════════════════════════════════════════════════════ */

btnYes.addEventListener('click', () => {
    // glow
    glowFlash.classList.add('active');

    // heart burst
    const emojis = ['❤️', '💖', '💗', '💕', '💘'];
    for (let i = 0; i < 35; i++) {
        const h = document.createElement('span');
        h.classList.add('heart');
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 380 + 120;
        h.style.setProperty('--tx', `${Math.cos(angle) * radius}px`);
        h.style.setProperty('--ty', `${Math.sin(angle) * radius}px`);
        h.style.setProperty('--rot', `${Math.random() * 360}deg`);
        h.style.left = '50%';
        h.style.top = '50%';
        h.style.animationDelay = `${Math.random() * .35}s`;
        heartBurst.appendChild(h);
    }

    // after burst settles → transition to flower page
    setTimeout(() => {
        goToPage(1);
        startBloomSequence();
        spawnParticles(flowerParticles, 45);
        // clear burst hearts
        setTimeout(() => { heartBurst.innerHTML = ''; }, 500);
    }, 1400);
});

/* ═══════════════════════════════════════════════════════
   4. FLOWER — BLOOM SEQUENCE
   ═══════════════════════════════════════════════════════ */

function startBloomSequence() {
    const stem = pageFlower.querySelector('.stem');
    const petals = bloom.querySelectorAll('.petal');
    const core = bloom.querySelector('.bloom__core');
    const leaves = pageFlower.querySelectorAll('.leaf');

    // reset everything
    stem.classList.remove('grow');
    petals.forEach(p => { p.classList.remove('bloom-anim'); p.style.animationDelay = ''; });
    core.classList.remove('show');
    leaves.forEach(l => l.classList.remove('show'));
    flowerCaption.classList.remove('show');
    bloomAgain.classList.remove('flower-btn-visible');
    bloomAgain.classList.add('flower-btn-hidden');
    btnNext.classList.remove('flower-btn-visible');
    btnNext.classList.add('flower-btn-hidden');

    // force reflow
    void stem.offsetWidth;

    // 1) grow stem
    stem.classList.add('grow');

    // 2) show leaves
    setTimeout(() => {
        leaves.forEach((l, i) => {
            setTimeout(() => l.classList.add('show'), i * 250);
        });
    }, 900);

    // 3) bloom petals
    petals.forEach((p, i) => {
        p.style.animationDelay = `${i * 0.18}s`;
        setTimeout(() => p.classList.add('bloom-anim'), 1400);
    });

    // 4) core glow
    setTimeout(() => core.classList.add('show'), 3200);

    // 5) caption + buttons
    setTimeout(() => flowerCaption.classList.add('show'), 3800);
    setTimeout(() => {
        bloomAgain.classList.remove('flower-btn-hidden');
        bloomAgain.classList.add('flower-btn-visible');
        btnNext.classList.remove('flower-btn-hidden');
        btnNext.classList.add('flower-btn-visible');
    }, 4200);
}

/* Bloom Again */
bloomAgain.addEventListener('click', () => {
    startBloomSequence();
    spawnParticles(flowerParticles, 45);
});

/* Continue → Message Page */
btnNext.addEventListener('click', () => {
    goToPage(2);
    spawnParticles(messageParticles, 30);
    setTimeout(startTypewriter, 600);
    startFloatingHearts();
});

/* ═══════════════════════════════════════════════════════
   5. TYPEWRITER + FLOATING HEARTS
   ═══════════════════════════════════════════════════════ */

function startTypewriter() {
    typewriterEl.textContent = '';
    msgSignature.classList.remove('show');
    btnRestart.classList.remove('msg-btn-visible');
    btnRestart.classList.add('msg-btn-hidden');

    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    typewriterEl.appendChild(cursor);

    let idx = 0;
    function type() {
        if (idx < LOVE_MESSAGE.length) {
            typewriterEl.insertBefore(document.createTextNode(LOVE_MESSAGE[idx]), cursor);
            idx++;
            setTimeout(type, 55 + Math.random() * 45);
        } else {
            setTimeout(() => {
                cursor.style.display = 'none';
                msgSignature.classList.add('show');
                setTimeout(() => {
                    btnRestart.classList.remove('msg-btn-hidden');
                    btnRestart.classList.add('msg-btn-visible');
                }, 800);
            }, 500);
        }
    }
    type();
}

function startFloatingHearts() {
    // clear previous interval if any
    if (heartsInterval) clearInterval(heartsInterval);
    floatingHearts.innerHTML = '';

    heartsInterval = setInterval(() => {
        // only spawn if message page visible
        if (currentPage !== 2) return;
        const h = document.createElement('span');
        h.classList.add('float-heart');
        h.textContent = ['♥', '❤️', '💕', '💗'][Math.floor(Math.random() * 4)];
        h.style.left = `${Math.random() * 100}%`;
        h.style.fontSize = `${Math.random() * .9 + .8}rem`;
        h.style.animationDuration = `${Math.random() * 4 + 5}s`;
        floatingHearts.appendChild(h);
        setTimeout(() => h.remove(), 10000);
    }, 900);
}

/* ═══════════════════════════════════════════════════════
   6. RESTART
   ═══════════════════════════════════════════════════════ */

btnRestart.addEventListener('click', () => {
    // reset hero state
    glowFlash.classList.remove('active');
    heartBurst.innerHTML = '';
    btnNo.classList.remove('dodging');
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.textContent = '😢 No';
    dodgeCount = 0;

    // clear floating hearts
    if (heartsInterval) clearInterval(heartsInterval);
    floatingHearts.innerHTML = '';

    goToPage(0);
});

/* ═══════════════════════════════════════════════════════
   7. MUSIC TOGGLE
   ═══════════════════════════════════════════════════════ */

musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => { });
        musicIcon.textContent = '🎵';
    }
    musicPlaying = !musicPlaying;
});
