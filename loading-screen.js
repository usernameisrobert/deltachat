// Boot loading screen. Warms the browser HTTP cache for every asset in
// parallel (high concurrency), retrying any that fail, then reveals the game.
(function () {
    if (typeof window.BOOT_ASSETS === 'undefined' || !window.BOOT_ASSETS.length) {
        show();
        return;
    }
    const ASSETS = window.BOOT_ASSETS;
    const CONCURRENCY = 16;      // parallel fetches (browser queues the rest)
    const MAX_RETRIES = 5;       // attempts per asset before giving up
    const RETRY_DELAY = 250;     // ms between retry waves

    const overlay = document.getElementById('boot-screen');
    const fillEl = document.getElementById('boot-fill');
    const pctEl = document.getElementById('boot-pct');
    const statusEl = document.getElementById('boot-status');

    let done = 0;      // total assets finished (success or gave up)
    let success = 0;
    const total = ASSETS.length;

    function fmt(ms) {
        return ms < 1000 ? ms + 'ms' : (ms / 1000).toFixed(1) + 's';
    }

    async function loadOne(url) {
        let lastErr = null;
        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                const res = await fetch(url, { cache: 'default', credentials: 'same-origin' });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                // Reading the body forces the full download so it lands in cache.
                await res.blob();
                success++;
                return;
            } catch (e) {
                lastErr = e;
                if (attempt < MAX_RETRIES) {
                    await new Promise(r => setTimeout(r, RETRY_DELAY * (attempt + 1)));
                }
            }
        }
        console.warn('Asset failed after retries:', url, lastErr);
    }

    function paint() {
        if (fillEl) fillEl.style.width = Math.round((success / total) * 100) + '%';
        if (pctEl) pctEl.textContent = success + ' / ' + total;
        if (statusEl) statusEl.textContent = 'warming cache (' + ASSETS.length + ' files)';
    }

    async function run() {
        paint();
        let i = 0;
        async function worker() {
            while (true) {
                const idx = i++;
                if (idx >= total) return;
                await loadOne(ASSETS[idx]);
                done++;
                paint();
            }
        }
        const start = performance.now();
        const workers = [];
        for (let w = 0; w < CONCURRENCY; w++) workers.push(worker());
        await Promise.all(workers);
        finish(performance.now() - start);
    }

    function finish(ms) {
        if (statusEl) statusEl.textContent = 'ready in ' + fmt(ms);
        // Brief hold so the "100% ready" state reads before the fade.
        setTimeout(show, 180);
    }

    function show() {
        if (!overlay) return;
        overlay.classList.add('boot-hidden');
        const warning = document.getElementById('warning-overlay');
        const ok = document.getElementById('warning-ok');
        if (warning) {
            setTimeout(() => { warning.classList.remove('hidden'); }, 500);
            if (ok) ok.addEventListener('click', () => warning.classList.add('hidden'));
        }
        setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 500);
    }

    // Start after first paint so the overlay is visible immediately.
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        run();
    } else {
        document.addEventListener('DOMContentLoaded', run);
    }
})();