/* ============================================================
   THEME
   ============================================================ */
const themeSwitch = document.getElementById('themeSwitch');
const body = document.body;

function applyTheme(isLight) {
    body.classList.toggle('light-mode', isLight);
    if (themeSwitch) themeSwitch.checked = isLight;
}

document.addEventListener('DOMContentLoaded', function () {
    const saved       = localStorage.getItem('themePreference');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved === 'light' || (saved === null && prefersLight));
    initPage();
});

if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
        const isLight = themeSwitch.checked;
        localStorage.setItem('themePreference', isLight ? 'light' : 'dark');
        applyTheme(isLight);
    });
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
const ICON_MENU  = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
const ICON_CLOSE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

function displayMenu() {
    const btn    = document.querySelector('.toggle-menu');
    const menu   = document.getElementById('nav-menu');
    const header = document.querySelector('header');
    if (!menu) return;

    const willOpen = !menu.classList.contains('show');
    btn.setAttribute('aria-expanded', willOpen);
    btn.innerHTML = willOpen ? ICON_CLOSE : ICON_MENU;
    document.body.classList.toggle('menu-open', willOpen);

    if (willOpen) {
        // Move nav to <body> so it escapes header's backdrop-filter containing block,
        // which would otherwise confine position:fixed to the 60px header height.
        document.body.appendChild(menu);
        requestAnimationFrame(() => menu.classList.add('show'));
    } else {
        menu.classList.remove('show');
        if (header && !header.contains(menu)) header.appendChild(menu);
    }
}

function closeMenu() {
    const btn    = document.querySelector('.toggle-menu');
    const menu   = document.getElementById('nav-menu');
    const header = document.querySelector('header');
    if (!menu) return;
    menu.classList.remove('show');
    document.body.classList.remove('menu-open');
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.innerHTML = ICON_MENU; }
    if (header && !header.contains(menu)) header.appendChild(menu);
}

// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

// Close when a nav link is tapped
document.addEventListener('click', function (e) {
    const menu = document.getElementById('nav-menu');
    if (!menu || !menu.classList.contains('show')) return;
    if (e.target.closest('#nav-menu a')) closeMenu();
});

/* ============================================================
   NAV LOGO PERIODIC GLITCH
   ============================================================ */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setInterval(() => {
        const tagOpen  = document.querySelector('.tag-open');
        const tagClose = document.querySelector('.tag-close');
        if (!tagOpen || !tagClose) return;
        tagOpen.classList.add('tag-glitch');
        tagClose.classList.add('tag-glitch');
        setTimeout(() => {
            tagOpen.classList.remove('tag-glitch');
            tagClose.classList.remove('tag-glitch');
        }, 420);
    }, 4000);
})();

/* ============================================================
   PAGE ROUTER
   ============================================================ */
function initPage() {
    const path = window.location.pathname;
    if (path === '/' || path.endsWith('index.html') || path.endsWith('/')) {
        initHero();
    }
    if (path.endsWith('projects.html')) {
        initProjects();
    }
}

/* ============================================================
   HERO ORCHESTRATION
   ============================================================ */
function initHero() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Grab elements
    const tagLeft   = document.getElementById('tag-left');
    const tagRight  = document.getElementById('tag-right');
    const devText   = document.getElementById('hero-dev-text');
    const heroName  = document.getElementById('hero-name');
    const codeWin   = document.getElementById('code-window');
    const cursor    = document.getElementById('cw-cursor');

    if (reducedMotion) {
        // Skip all animations — show everything immediately
        if (cursor) cursor.style.display = 'inline-block';
        startTyping();
        return;
    }

    // ── Hide elements that JS will animate ──────────────────
    if (devText) {
        devText.style.opacity   = '0';
        devText.style.filter    = 'blur(10px)';
        devText.style.transform = 'scale(0.9)';
        devText.style.transition = 'opacity 0.45s ease, filter 0.45s ease, transform 0.45s ease';
    }

    if (tagLeft) {
        tagLeft.style.opacity   = '0';
        tagLeft.style.transform = 'translateX(-70px)';
        tagLeft.style.transition = 'opacity 0.12s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    if (tagRight) {
        tagRight.style.opacity   = '0';
        tagRight.style.transform = 'translateX(70px)';
        tagRight.style.transition = 'opacity 0.12s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    if (cursor) cursor.style.display = 'none';

    // ── Step 1 — T=0.30s: "Dev" materialises ────────────────
    setTimeout(() => {
        if (devText) {
            devText.style.opacity   = '1';
            devText.style.filter    = 'blur(0)';
            devText.style.transform = 'scale(1)';
        }
    }, 300);

    // ── Step 2 — T=0.75s: brackets sweep in ─────────────────
    setTimeout(() => {
        if (tagLeft) {
            tagLeft.style.opacity   = '1';
            tagLeft.style.transform = 'translateX(0)';
        }
    }, 750);

    setTimeout(() => {
        if (tagRight) {
            tagRight.style.opacity   = '1';
            tagRight.style.transform = 'translateX(0)';
        }
    }, 800);

    // ── Step 3 — T=1.15s: brackets start pulsing ────────────
    setTimeout(() => {
        if (tagLeft)  tagLeft.classList.add('tag-glow');
        if (tagRight) tagRight.classList.add('tag-glow');
    }, 1150);

    // ── Step 4 — T=1.85s: typing begins ─────────────────────
    setTimeout(startTyping, 1850);

    // ── Hover glitch on hero name ────────────────────────────
    if (heroName) {
        let glitching = false;
        heroName.addEventListener('mouseenter', () => {
            if (glitching || !tagLeft || !tagRight) return;
            glitching = true;

            tagLeft.classList.remove('tag-glow');
            tagRight.classList.remove('tag-glow');
            tagLeft.classList.add('tag-glitch');
            tagRight.classList.add('tag-glitch');

            setTimeout(() => {
                tagLeft.classList.remove('tag-glitch');
                tagRight.classList.remove('tag-glitch');
                tagLeft.classList.add('tag-glow');
                tagRight.classList.add('tag-glow');
                glitching = false;
            }, 420);
        });
    }

    // ── Canvas background ────────────────────────────────────
    initCanvas();

    // ── 3-D mouse parallax on code window ───────────────────
    if (codeWin) initParallax(codeWin);
}

/* ============================================================
   CANVAS — scrolling code columns (Matrix-style but with real dev.js code)
   ============================================================ */
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Code lines — actual dev-themed easter eggs in the background
    const pool = [
        { text: 'const dev = "Dev Ghodasara";',       type: 'keyword' },
        { text: 'const passion = "problem solving";',  type: 'string'  },
        { text: 'function build(idea) {',              type: 'keyword' },
        { text: '  return idea.execute();',             type: 'default' },
        { text: '}',                                   type: 'default' },
        { text: "import { creativity } from 'dev';",   type: 'keyword' },
        { text: "// it's in the name",                 type: 'comment' },
        { text: 'export default developer;',            type: 'keyword' },
        { text: 'let creativity = Infinity;',           type: 'keyword' },
        { text: '<Dev/>',                              type: 'tag'     },
        { text: '<Dev name="Ghodasara" />',            type: 'tag'     },
        { text: 'git commit -m "shipping it"',          type: 'comment' },
        { text: 'class Developer extends Human {',     type: 'keyword' },
        { text: '  build() { return magic; }',         type: 'default' },
        { text: '  name = "Dev";',                     type: 'default' },
        { text: '}',                                   type: 'default' },
        { text: 'const life = { dev: true };',         type: 'keyword' },
        { text: 'while (true) { learn(); }',            type: 'keyword' },
        { text: '// TODO: change the world',            type: 'comment' },
        { text: 'if (name === "Dev") solve();',         type: 'keyword' },
        { text: 'const stack = ["HTML","CSS","JS"];',  type: 'default' },
        { text: 'async function devLife() {',          type: 'keyword' },
        { text: '  await coffee.drink();',              type: 'default' },
        { text: '  return work.done();',                type: 'default' },
        { text: '}',                                   type: 'default' },
        { text: '/* Dev === Developer */',              type: 'comment' },
        { text: 'const answer = 42;',                  type: 'keyword' },
        { text: 'npm run build',                       type: 'default' },
        { text: '=> problem.solution()',               type: 'default' },
        { text: 'dev.thinks(problem);',                type: 'default' },
        { text: 'const name = "Dev";',                 type: 'keyword' },
        { text: '// name === profession',              type: 'comment' },
        { text: 'throw new Error("feature not bug");', type: 'default' },
        { text: 'git push origin main',                type: 'comment' },
        { text: 'const bug = feature.misunderstood();',type: 'comment' },
    ];

    const FONT_SIZE   = 11.5;
    const LINE_HEIGHT = 21;
    const NUM_COLS    = 7;

    // Color palettes per syntax type
    const DARK  = { keyword:[100,210,255], string:[48,209,88], comment:[110,110,115], tag:[255,159,10], default:[235,235,245] };
    const LIGHT = { keyword:[0,85,212],    string:[26,122,53], comment:[130,130,140], tag:[192,64,0],   default:[60,60,70]    };

    function buildColumns() {
        const pad    = Math.max(40, canvas.width * 0.04);
        const usable = canvas.width - pad * 2;
        const colW   = usable / NUM_COLS;

        return Array.from({ length: NUM_COLS }, (_, i) => {
            const lines = [...pool].sort(() => Math.random() - 0.5);
            return {
                x:      pad + i * colW + (Math.random() * 16 - 8),
                lines,
                speed:  0.18 + Math.random() * 0.32,
                alpha:  0.045 + Math.random() * 0.055,
                // Random starting phase so columns aren't synchronised
                offset: Math.random() * lines.length * LINE_HEIGHT,
            };
        });
    }

    let columns = buildColumns();
    window.addEventListener('resize', () => { columns = buildColumns(); });

    let raf;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const palette = body.classList.contains('light-mode') ? LIGHT : DARK;
        ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

        columns.forEach(col => {
            const totalH    = col.lines.length * LINE_HEIGHT;
            const scrolled  = col.offset;
            // Which line sits at (or just above) y=0
            const topLI     = Math.floor(scrolled / LINE_HEIGHT) % col.lines.length;
            // Sub-line-height fractional shift for smooth motion
            const subOffset = scrolled % LINE_HEIGHT;

            let y  = -subOffset;
            let li = topLI;

            while (y < canvas.height + LINE_HEIGHT) {
                if (y > -LINE_HEIGHT) {
                    // Safe modulo (JS % can return negative)
                    const idx  = ((li % col.lines.length) + col.lines.length) % col.lines.length;
                    const line = col.lines[idx];
                    const [r, g, b] = palette[line.type] || palette.default;
                    ctx.fillStyle = `rgba(${r},${g},${b},${col.alpha})`;
                    ctx.fillText(line.text, col.x, y);
                }
                y  += LINE_HEIGHT;
                li++;
            }

            col.offset += col.speed;
            // Prevent float overflow after very long sessions
            if (col.offset > totalH * 10000) col.offset %= totalH;
        });

        raf = requestAnimationFrame(animate);
    }

    // Wait for font to load so first frame uses the right typeface
    document.fonts.ready.then(() => animate());

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(raf);
        else animate();
    });
}

/* ============================================================
   3-D PARALLAX — code window follows mouse
   ============================================================ */
function initParallax(el) {
    const MAX = 7; // max degrees of tilt
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function tick() {
        currentX = lerp(currentX, targetX, 0.08);
        currentY = lerp(currentY, targetY, 0.08);

        el.style.transform = `perspective(900px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;

        // Keep looping only if still moving
        if (Math.abs(currentX - targetX) > 0.01 || Math.abs(currentY - targetY) > 0.01) {
            rafId = requestAnimationFrame(tick);
        }
    }

    document.addEventListener('mousemove', e => {
        const cx = window.innerWidth  / 2;
        const cy = window.innerHeight / 2;
        targetX = ((e.clientX - cx) / cx) * MAX;
        targetY = -((e.clientY - cy) / cy) * MAX;

        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
    });

    document.addEventListener('mouseleave', () => {
        targetX = 0;
        targetY = 0;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
    });
}

/* ============================================================
   TYPING ANIMATION — code window
   ============================================================ */
function startTyping() {
    const output = document.getElementById('code-output');
    const cursor = document.getElementById('cw-cursor');
    if (!output) return;

    // [text, cssClass | null]
    const lines = [
        [['// Hi, I\'m Dev', 'syn-comment']],
        [],
        [['const ', 'syn-keyword'], ['developer', 'syn-name'], [' = {', null]],
        [['  ', null], ['name',   'syn-key'], [': ', null], ['"Dev Ghodasara"',  'syn-string'], [',', null]],
        [['  ', null], ['origin', 'syn-key'], [': ', null], ['"India → USA"',    'syn-string'], [',', null]],
        [['  ', null], ['passion','syn-key'], [': ', null], ['"problem solving"','syn-string'], [',', null]],
        [['}', null]],
        [],
    ];

    const CHAR_DELAY = 26;
    const LINE_PAUSE = 110;

    let lineIdx = 0, tokenIdx = 0, charIdx = 0;
    let currentSpan = null;

    if (cursor) cursor.style.display = 'none';

    function next() {
        if (lineIdx >= lines.length) {
            if (cursor) cursor.style.display = 'inline-block';
            return;
        }

        const tokens = lines[lineIdx];

        if (tokens.length === 0) {
            output.appendChild(document.createTextNode('\n'));
            lineIdx++; tokenIdx = 0; charIdx = 0;
            setTimeout(next, LINE_PAUSE);
            return;
        }

        if (tokenIdx === 0 && charIdx === 0 && lineIdx > 0) {
            output.appendChild(document.createTextNode('\n'));
        }

        const [text, cls] = tokens[tokenIdx];

        if (charIdx === 0) {
            currentSpan = cls ? document.createElement('span') : null;
            if (currentSpan) {
                currentSpan.className = cls;
                output.appendChild(currentSpan);
            }
        }

        const char = text[charIdx];
        if (currentSpan) currentSpan.textContent += char;
        else output.appendChild(document.createTextNode(char));

        charIdx++;

        if (charIdx >= text.length) {
            charIdx = 0;
            tokenIdx++;
            if (tokenIdx >= tokens.length) {
                tokenIdx = 0;
                lineIdx++;
                setTimeout(next, LINE_PAUSE);
                return;
            }
        }

        setTimeout(next, CHAR_DELAY);
    }

    setTimeout(next, 200);
}

/* ============================================================
   PROJECTS — IntersectionObserver fade-in
   ============================================================ */
function initProjects() {
    const cards = document.querySelectorAll('.bento-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(24px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        observer.observe(card);
    });
}

/* ============================================================
   FORM HELPERS
   ============================================================ */
function clearForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.reset();
    const ta = form.querySelector('textarea[name="message"]');
    if (ta) autoResize(ta);
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function submitToGoogleForm(event, form) {
    event.preventDefault();

    const formStatus = document.getElementById('form-status');
    const submitBtn  = form.querySelector('.form-btn-submit');

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    const formData = {
        timestamp:    new Date().toString(),
        first_name:   form.first_name.value,
        last_name:    form.last_name.value,
        phone_number: form.phone_number ? form.phone_number.value : '',
        email:        form.email.value,
        subject:      form.subject.value,
        message:      form.message.value,
    };

    fetch('https://script.google.com/macros/s/AKfycbxb61OMdWG_JwGLKNVm1hn79xvFe_z6Xi_57rCTuTL2zAp_pQ3GNk85CuLo3mkdUro/exec', {
        method: 'POST',
        body: JSON.stringify(formData),
    })
    .then(() => {
        if (formStatus) formStatus.textContent = '// Message sent successfully.';
        clearForm();
        setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 3000);
    })
    .catch(() => {
        if (formStatus) formStatus.textContent = '// Error sending — please try again.';
        setTimeout(() => { if (formStatus) formStatus.textContent = ''; }, 3000);
    })
    .finally(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
    });
}
