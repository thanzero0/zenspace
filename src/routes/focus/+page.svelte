<script>
    import { onMount } from 'svelte';

    const SOUNDS = [
        { id: 'rain', label: '🌧️ Rain', freq: 0.8, type: 'brown' },
        { id: 'forest', label: '🌿 Forest', freq: 1.2, type: 'green' },
        { id: 'ocean', label: '🌊 Ocean', freq: 0.6, type: 'blue' },
        { id: 'cafe', label: '☕ Café', freq: 1.0, type: 'pink' },
        { id: 'fire', label: '🔥 Fire', freq: 0.9, type: 'warm' },
    ];

    /** @type {any} */

    let activeSound = $state(null);
    /** @type {any} */
    let volume = $state(0.5);
    /** @type {any} */
    let timerMinutes = $state(25);
    /** @type {any} */
    let timerRunning = $state(false);
    /** @type {any} */
    let timerLeft = $state(25 * 60);
    let timerInterval;
    let audioCtx;
    let gainNode;
    let noiseSource;
    /** @type {any} */
    let isFullscreen = $state(false);

    let timerDisplay = $derived(`${Math.floor(timerLeft / 60).toString().padStart(2,'0')}:${(timerLeft % 60).toString().padStart(2,'0')}`);

    function createNoise(type) /* @type {any} */ {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (noiseSource) { try { noiseSource.stop(); } catch(e) {} }

        gainNode = audioCtx.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioCtx.destination);

        const bufferSize = audioCtx.sampleRate * 4;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        /** @type {any} */
        let lastOut = $state(0);
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            if (type === 'brown') {
                lastOut = (lastOut + (0.02 * white)) / 1.02;
                data[i] = lastOut * 3.5;
            } else if (type === 'pink') {
                data[i] = white * 0.3;
            } else {
                data[i] = white * 0.15;
            }
        }

        noiseSource = audioCtx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;
        noiseSource.connect(gainNode);
        noiseSource.start();
    }

    function toggleSound(sound) /* @type {any} */ {
        if (activeSound === sound.id) {
            if (noiseSource) { try { noiseSource.stop(); } catch(e) {} }
            activeSound = null;
        } else {
            activeSound = sound.id;
            createNoise(sound.type);
        }
    }

    function updateVolume() {
        if (gainNode) gainNode.gain.value = volume;
    }

    function toggleTimer() {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
        } else {
            timerRunning = true;
            timerInterval = setInterval(() => {
                if (timerLeft > 0) timerLeft--;
                else { clearInterval(timerInterval); timerRunning = false; }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerRunning = false;
        timerLeft = timerMinutes * 60;
    }

    function setTimer(mins) /* @type {any} */ {
        timerMinutes = mins;
        clearInterval(timerInterval);
        timerRunning = false;
        timerLeft = mins * 60;
    }

    import { onDestroy } from 'svelte';
    onDestroy(() => {
        clearInterval(timerInterval);
        if (noiseSource) { try { noiseSource.stop(); } catch(e) {} }
        if (audioCtx) { try { audioCtx.close(); } catch(e) {} }
    });
</script>

<svelte:head><title>Focus Mode — Zenspace</title></svelte:head>

<div class="app-container" class:fullscreen={isFullscreen}>
    <div class="header">
        <div class="brand">🧠 Focus Mode</div>
        <div class="header-right">
            <button class="icon-btn" onclick={() => isFullscreen = !isFullscreen}>{isFullscreen ? '⊠' : '⛶'}</button>
            <a href="/" class="home-btn">⌂ Home</a>
        </div>
    </div>

    <div class="main">
        <!-- Timer -->
        <div class="timer-panel">
            <div class="timer-presets">
                {#each [15, 25, 45, 60] as mins}
                    <button class="preset-btn" class:active={timerMinutes === mins && !timerRunning} onclick={() => setTimer(mins)}>{mins}m</button>
                {/each}
            </div>
            <div class="timer-display">{timerDisplay}</div>
            <div class="timer-controls">
                <button class="timer-btn" onclick={toggleTimer}>{timerRunning ? '⏸ Pause' : '▶ Start'}</button>
                <button class="timer-reset" onclick={resetTimer}>↺ Reset</button>
            </div>
        </div>

        <!-- Ambient Sounds -->
        <div class="sounds-panel">
            <div class="panel-title">Ambient Sounds</div>
            <div class="sounds-grid">
                {#each SOUNDS as sound}
                    <button
                        class="sound-btn"
                        class:active={activeSound === sound.id}
                        onclick={() => toggleSound(sound)}
                    >
                        <span class="sound-icon">{sound.label.split(' ')[0]}</span>
                        <span class="sound-name">{sound.label.split(' ')[1]}</span>
                    </button>
                {/each}
            </div>

            {#if activeSound}
                <div class="volume-row">
                    <span>🔈</span>
                    <input type="range" min="0" max="1" step="0.01" bind:value={volume} on:input={updateVolume}>
                    <span>🔊</span>
                </div>
            {/if}
        </div>

        <!-- Quote -->
        <div class="quote-panel">
            <p>"The key is not to prioritize what's on your schedule, but to schedule your priorities."</p>
            <cite>— Stephen Covey</cite>
        </div>
    </div>
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #030303;
        color: #e5e5e5;
        font-family: 'Inter', sans-serif;
        transition: background 0.5s;
    }
    .app-container.fullscreen {
        background: #000;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 30px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .brand { font-size: 18px; font-weight: 700; }
    .header-right { display: flex; gap: 10px; align-items: center; }

    .icon-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
    }

    .home-btn {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 13px;
        padding: 6px 14px;
        border-radius: 8px;
        background: rgba(255,255,255,0.05);
        transition: all 0.2s;
    }
    .home-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 40px;
        padding: 40px;
    }

    .timer-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
    }

    .timer-presets { display: flex; gap: 8px; }
    .preset-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #a3a3a3;
        padding: 6px 16px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
    }
    .preset-btn.active { background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.3); }
    .preset-btn:hover { color: #fff; }

    .timer-display {
        font-size: 90px;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: -4px;
        line-height: 1;
    }

    .timer-controls { display: flex; gap: 16px; align-items: center; }
    .timer-btn {
        background: #fff;
        color: #000;
        border: none;
        padding: 14px 36px;
        border-radius: 50px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .timer-btn:hover { background: #e5e5e5; transform: translateY(-1px); }
    .timer-reset {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #a3a3a3;
        padding: 14px 24px;
        border-radius: 50px;
        font-size: 15px;
        cursor: pointer;
    }
    .timer-reset:hover { color: #fff; }

    .sounds-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        width: 100%;
        max-width: 500px;
    }

    .panel-title { font-size: 13px; color: #737373; text-transform: uppercase; letter-spacing: 1.5px; }

    .sounds-grid {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    }

    .sound-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 16px 20px;
        cursor: pointer;
        color: #a3a3a3;
        transition: all 0.2s;
        min-width: 80px;
    }
    .sound-btn.active { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); color: #fff; }
    .sound-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .sound-icon { font-size: 24px; }
    .sound-name { font-size: 12px; font-weight: 500; }

    .volume-row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
    }
    .volume-row input { flex: 1; accent-color: #fff; }

    .quote-panel {
        max-width: 500px;
        text-align: center;
        border-top: 1px solid rgba(255,255,255,0.06);
        padding-top: 24px;
    }
    .quote-panel p { font-size: 16px; line-height: 1.6; color: #a3a3a3; font-style: italic; margin: 0 0 8px 0; }
    .quote-panel cite { font-size: 13px; color: #525252; }
</style>
