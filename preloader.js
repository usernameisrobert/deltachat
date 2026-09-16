class AssetPreloader {
    constructor() {
        // Web Audio API: one shared context for both SFX and music.
        // Buffer sources start() sample-accurately, so blips never get dropped
        // and music loops without the gap an <audio loop> element leaves.
        this.audioContext = null;
        this.soundBuffers = new Map();  // key -> AudioBuffer (decoded)
        this.soundPromises = new Map(); // url -> Promise<AudioBuffer>
        this.musicBuffers = new Map();  // url -> AudioBuffer (decoded)
        this.musicPromises = new Map(); // url -> Promise<AudioBuffer>

        // Music state
        this.musicSource = null;
        this.musicGain = null;
        this.currentMusicPath = null;
        this.musicGen = 0; // guards against overlapping async playMusic calls
        this.musicFadeTimer = null; // timeout driving an in-progress fade-out
        this.musicFadeGen = 0; // guards against overlapping fades / new music

        // Per-character ready flags (kept for compatibility with the rest of the app)
        this.audioReady = false;
        this.alphysAudioReady = false;
        this.torielAudioReady = false;
        this.lancerAudioReady = false;
        this.rouxlsAudioReady = false;
        this.noelleAudioReady = false;
        this.berdlyAudioReady = false;
        this.dynamicAudioReady = false;
        this.tobyAudioReady = false;
        this.spamtonAudioReady = false;
        this.queenAudioReady = false;
        this.tennaAudioReady = false;
        this.nubertAudioReady = false;
        this.rambAudioReady = false;

        this.soundFiles = {
            susie: '/txsus.wav',
            alphys: '/txalp.wav',
            toriel: '/txral.wav',
            lancer: '/txlancer.wav',
            rouxls: '/txkri.wav',
            noelle: '/txnoelle.wav',
            berdly: '/txberdly.wav',
            toby: '/txkri.wav',
            spamton: '/txspam.wav',
            queen: '/txqueen.wav',
            nubert: '/txkri.wav',
            ramb: '/txkri.wav',
            pink: '/txkri.wav',
            pluey: '/txkri.wav',
            dynamic: '/txkri.wav'
        };
        this.tennaFiles = [];
        for (let i = 1; i <= 10; i++) this.tennaFiles.push(`/txtenna${i}.wav`);

        // Flowery's per-letter "voicenoise" blips (cycled while he talks) and
        // his one-shot voice clips, decoded on demand by name.
        this.floweryNoiseFiles = [
            '/snd_flowery_voicenoise_1.wav',
            '/snd_flowery_voicenoise_2.wav',
            '/snd_flowery_voicenoise_3.wav'
        ];

        this.queenPitches = [0.97, 1.0, 1.03];

        // Browsers block audio until a user gesture. Resume the context on the
        // first interaction so sounds are ready the moment the player starts.
        this.resumeOnGesture = () => this.getAudioContext();
        document.addEventListener('pointerdown', this.resumeOnGesture);
        document.addEventListener('keydown', this.resumeOnGesture);

        this.initSoundBuffers();
    }

    getAudioContext() {
        if (!this.audioContext) {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            if (!Ctor) return null;
            this.audioContext = new Ctor();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(() => {});
        }
        return this.audioContext;
    }

    fetchAndDecode(url, cacheMap, cachePromises) {
        if (cachePromises.has(url)) return cachePromises.get(url);
        const p = fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch ${url}`);
                return res.arrayBuffer();
            })
            .then(buf => {
                const ctx = this.getAudioContext();
                if (!ctx) throw new Error('No AudioContext available');
                return ctx.decodeAudioData(buf);
            })
            .then(decoded => {
                cacheMap.set(url, decoded);
                return decoded;
            })
            .catch(err => {
                cachePromises.delete(url);
                console.warn('Audio load failed:', url, err);
                return null;
            });
        cachePromises.set(url, p);
        return p;
    }

    readyFlagFor(name) {
        switch (name) {
            case 'susie': return 'audioReady';
            case 'alphys': return 'alphysAudioReady';
            case 'toriel': return 'torielAudioReady';
            case 'lancer': return 'lancerAudioReady';
            case 'rouxls': return 'rouxlsAudioReady';
            case 'noelle': return 'noelleAudioReady';
            case 'berdly': return 'berdlyAudioReady';
            case 'toby': return 'tobyAudioReady';
            case 'spamton': return 'spamtonAudioReady';
            case 'queen': return 'queenAudioReady';
            case 'nubert': return 'nubertAudioReady';
            case 'ramb': return 'rambAudioReady';
            case 'dynamic': return 'dynamicAudioReady';
        }
        return null;
    }

    initSoundBuffers() {
        for (const [name, url] of Object.entries(this.soundFiles)) {
            this.fetchAndDecode(url, this.soundBuffers, this.soundPromises).then(decoded => {
                if (!decoded) return;
                this.soundBuffers.set(name, decoded);
                const flag = this.readyFlagFor(name);
                if (flag) this[flag] = true;
            });
        }

        let remaining = this.tennaFiles.length;
        this.tennaFiles.forEach((url, idx) => {
            this.fetchAndDecode(url, this.soundBuffers, this.soundPromises).then(decoded => {
                if (!decoded) return;
                this.soundBuffers.set('tenna' + idx, decoded);
                remaining--;
                if (remaining <= 0) this.tennaAudioReady = true;
            });
        });

        this.floweryNoiseFiles.forEach((url, idx) => {
            this.fetchAndDecode(url, this.soundBuffers, this.soundPromises).then(decoded => {
                if (!decoded) return;
                this.soundBuffers.set('flowerynoise' + idx, decoded);
            });
        });
    }

    // Play a decoded buffer as a fresh source node. Each call creates its own
    // source, so rapid-fire blips never drop like stop/restarting an <audio>
    // element could. A tiny lead time schedules the blip onto the audio clock
    // ahead of the JS timer so it lands on time even when the main thread is
    // busy or the device polls slowly.
    playSound(name, { lead = 0.02, pitch = 1, gain = 0.5 } = {}) {
        const ctx = this.getAudioContext();
        if (!ctx || ctx.state === 'suspended') return;
        const buf = this.soundBuffers.get(name);
        if (!buf) return;
        try {
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.playbackRate.value = pitch;
            const gainNode = ctx.createGain();
            gainNode.gain.value = gain;
            src.connect(gainNode);
            gainNode.connect(ctx.destination);
            src.start(ctx.currentTime + lead);
        } catch (e) {
            // Ignore audio errors
        }
    }

    playCharacterSound(character) {
        if (character === 'susie') {
            this.playSound('susie');
        } else if (character === 'alphys') {
            this.playSound('alphys');
        } else if (character === 'ralsei') {
            this.playSound('toriel');
        } else if (character === 'lancer') {
            this.playSound('lancer');
        } else if (character === 'rouxls') {
            this.playSound('rouxls');
        } else if (character === 'noelle') {
            this.playSound('noelle');
        } else if (character === 'berdly') {
            this.playSound('berdly');
        } else if (character === 'toby') {
            this.playSound('toby');
        } else if (character === 'spamton') {
            this.playSound('spamton');
        } else if (character === 'queen') {
            const pitch = this.queenPitches[Math.floor(Math.random() * this.queenPitches.length)];
            this.playSound('queen', { pitch: pitch });
        } else if (character === 'nubert') {
            this.playSound('nubert');
        } else if (character === 'ramb') {
            this.playSound('ramb');
        } else if (character === 'pluey') {
            this.playSound('pluey');
        } else if (character === 'flowery') {
            const idx = Math.floor(Math.random() * this.floweryNoiseFiles.length);
            this.playSound('flowerynoise' + idx);
        } else {
            this.playSound('dynamic');
        }
    }

    // Play a one-shot Flowery voice clip by canonical name. Clips are decoded
    // from disk on first use, then cached. Unknown/empty names are ignored so
    // the caller can safely pass any AI-chosen string.
    playFloweryVoiceClip(name) {
        if (!name) return;
        const safe = String(name).toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
        if (!safe) return;
        const key = 'floweryclip_' + safe;
        const url = '/snd_flowery_voiceclip_' + safe + '.wav';
        if (this.soundBuffers.has(key)) {
            this.playSound(key, { gain: 0.7 });
            return;
        }
        this.fetchAndDecode(url, this.soundBuffers, this.soundPromises).then(decoded => {
            if (!decoded) return;
            // fetchAndDecode caches under the URL; re-key under our clip name
            // so playSound() below (and every later call) hits the cache.
            this.soundBuffers.set(key, decoded);
            this.playSound(key, { gain: 0.7 });
        });
    }

    playDialogueSound() {
        this.playSound('susie');
    }

    playAlphysDialogueSound() {
        this.playSound('alphys');
    }

    playTorielDialogueSound() {
        this.playSound('toriel');
    }

    playLancerDialogueSound() {
        this.playSound('lancer');
    }

    playRouxlsDialogueSound() {
        this.playSound('rouxls');
    }

    playNoelleDialogueSound() {
        this.playSound('noelle');
    }

    playBerdlyDialogueSound() {
        this.playSound('berdly');
    }

    playTobyDialogueSound() {
        this.playSound('toby');
    }

    playSpamtonDialogueSound() {
        this.playSound('spamton');
    }

    playQueenDialogueSound() {
        const pitch = this.queenPitches[Math.floor(Math.random() * this.queenPitches.length)];
        this.playSound('queen', { pitch: pitch });
    }

    playDynamicDialogueSound() {
        this.playSound('dynamic');
    }

    playTennaDialogueSound() {
        const idx = Math.floor(Math.random() * this.tennaFiles.length);
        this.playSound('tenna' + idx);
    }

    playNubertDialogueSound() {
        this.playSound('nubert');
    }

    playRambDialogueSound() {
        this.playSound('ramb');
    }

    playPinkDialogueSound() {
        this.playSound('pink');
    }

    // ---- Music (seamless looping via Web Audio) ----

    async playMusic(url, pitch = 1.0) {
        const ctx = this.getAudioContext();
        if (!ctx) return;

        // Starting fresh music cancels any in-progress fade-out.
        if (this.musicFadeTimer) {
            clearTimeout(this.musicFadeTimer);
            this.musicFadeTimer = null;
        }
        this.musicFadeGen++;

        // Already playing this song: just retune and keep it going seamlessly.
        if (this.currentMusicPath === url && this.musicSource) {
            this.musicSource.playbackRate.value = pitch;
            if (this.musicGain) this.musicGain.gain.value = 0.3;
            return;
        }

        // Stop the current source; this also invalidates any in-flight decode.
        this.stopMusic();
        this.currentMusicPath = url;
        // Capture the generation AFTER stopMusic so this call isn't invalidated
        // by its own stop (stopMusic increments the generation counter).
        const gen = this.musicGen;

        let buf = this.musicBuffers.get(url);
        if (!buf) {
            buf = await this.fetchAndDecode(url, this.musicBuffers, this.musicPromises);
            if (!buf) return;
        }
        if (gen !== this.musicGen || this.currentMusicPath !== url) return; // superseded while decoding

        try {
            const src = ctx.createBufferSource();
            src.buffer = buf;
            src.loop = true; // AudioBufferSourceNode loops gaplessly
            src.playbackRate.value = pitch;
            const gain = ctx.createGain();
            gain.gain.value = 0.3;
            src.connect(gain);
            gain.connect(ctx.destination);
            src.start(0);
            this.musicSource = src;
            this.musicGain = gain;
        } catch (e) {
            console.warn('Music play failed:', e);
        }
    }

    stopMusic() {
        this.musicGen++; // invalidate any in-flight playMusic awaiting a decode
        if (this.musicSource) {
            try {
                this.musicSource.stop();
            } catch (e) {
                // Already stopped
            }
            this.musicSource = null;
        }
        if (this.musicGain) {
            this.musicGain.disconnect();
            this.musicGain = null;
        }
        this.currentMusicPath = null;
    }

    // Fade the current music out over `duration` ms, then stop it cleanly. If
    // new music starts before the fade finishes, the fade is cancelled so the
    // new track isn't muted.
    fadeOutMusic(duration = 800) {
        if (this.musicFadeTimer) {
            clearTimeout(this.musicFadeTimer);
            this.musicFadeTimer = null;
        }
        const gain = this.musicGain;
        const src = this.musicSource;
        if (!gain || !src) {
            this.stopMusic();
            return;
        }
        const ctx = gain.context;
        const start = ctx.currentTime;
        const startVal = gain.gain.value;
        const fadeGen = ++this.musicFadeGen;

        const step = () => {
            if (fadeGen !== this.musicFadeGen) return; // superseded
            const elapsed = ctx.currentTime - start;
            const t = Math.min(1, elapsed / (duration / 1000));
            gain.gain.value = startVal * (1 - t);
            if (t < 1) {
                this.musicFadeTimer = setTimeout(step, 30);
            } else {
                this.stopMusic();
            }
        };
        step();
    }
}
