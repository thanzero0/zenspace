<script>
    import { onMount, onDestroy } from 'svelte';

    let modes = [
        { id: 'focus', label: 'Focus', time: 25 * 60 },
        { id: 'shortBreak', label: 'Short Break', time: 5 * 60 },
        { id: 'longBreak', label: 'Long Break', time: 15 * 60 }
    ];
    
    /** @type {any} */
    
    let currentModeId = $state('focus');
    /** @type {any} */
    let timeLeft = $state(modes[0].time);
    /** @type {any} */
    let isRunning = $state(false);
    let timerInterval;

    let currentMode = $derived(modes.find(m => m.id === currentModeId));
    let minutes = $derived(Math.floor(timeLeft / 60).toString().padStart(2, '0'));
    let seconds = $derived((timeLeft % 60).toString().padStart(2, '0'));
    let progress = $derived(1 - (timeLeft / currentMode.time));
    
    function setMode(id) /* @type {any} */ {
        currentModeId = id;
        timeLeft = modes.find(m => m.id === id).time;
        isRunning = false;
        clearInterval(timerInterval);
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
        } else {
            isRunning = true;
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    playNotification();
                }
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = currentMode.time;
    }

    function playNotification() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // dummy short sound, or replace with real beep
            audio.play().catch(e => console.log('Audio play blocked'));
        } catch(e) {}
    }

    onDestroy(() => {
        clearInterval(timerInterval);
    });
</script>

<div class="app-container">
    <div class="header">
        <a href="/" class="home-btn">⌂ Home</a>
    </div>

    <div class="pomodoro-wrapper">
        <div class="mode-buttons">
            {#each modes as mode}
                <button 
                    class="mode-btn {currentModeId === mode.id ? 'active' : ''}" 
                    onclick={() => setMode(mode.id)}
                >
                    {mode.label}
                </button>
            {/each}
        </div>

        <div class="timer-display-container">
            <!-- Simple SVG Circle Progress -->
            <svg class="progress-ring" width="300" height="300">
                <circle 
                    class="progress-ring-circle-bg" 
                    stroke="rgba(255,255,255,0.05)" 
                    stroke-width="12" 
                    fill="transparent" 
                    r="140" 
                    cx="150" 
                    cy="150"
                />
                <circle 
                    class="progress-ring-circle" 
                    stroke="#ef4444" 
                    stroke-width="12" 
                    fill="transparent" 
                    r="140" 
                    cx="150" 
                    cy="150"
                    stroke-dasharray="{140 * 2 * Math.PI}"
                    stroke-dashoffset="{140 * 2 * Math.PI * (1 - progress)}"
                    style="transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 1s linear;"
                />
            </svg>
            <div class="timer-display">{minutes}:{seconds}</div>
        </div>

        <div class="controls">
            <button class="primary-btn" onclick={toggleTimer}>
                {isRunning ? 'Pause' : 'Start'}
            </button>
            <button class="secondary-btn" onclick={resetTimer}>Reset</button>
        </div>
    </div>
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background: #000;
        color: #fff;
        font-family: 'Outfit', sans-serif;
    }

    .header {
        position: absolute;
        top: 30px;
        left: 30px;
    }

    .home-btn {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
        background: rgba(255,255,255,0.1);
        transition: all 0.2s;
    }

    .home-btn:hover {
        background: rgba(255,255,255,0.2);
        color: #fff;
    }

    .pomodoro-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
        background: #111;
        padding: 50px;
        border-radius: 40px;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.05);
    }

    .mode-buttons {
        display: flex;
        gap: 10px;
        background: rgba(255,255,255,0.05);
        padding: 8px;
        border-radius: 100px;
    }

    .mode-btn {
        background: transparent;
        border: none;
        color: #a3a3a3;
        padding: 10px 24px;
        border-radius: 100px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.3s;
    }

    .mode-btn:hover {
        color: #fff;
    }

    .mode-btn.active {
        background: #ef4444;
        color: #fff;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }

    .timer-display-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 300px;
    }

    .timer-display {
        position: absolute;
        font-family: 'JetBrains Mono', monospace;
        font-size: 72px;
        font-weight: 700;
        letter-spacing: -2px;
    }

    .controls {
        display: flex;
        gap: 16px;
    }

    .controls button {
        border: none;
        padding: 16px 40px;
        border-radius: 100px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
    }

    .primary-btn {
        background: #fff;
        color: #000;
        box-shadow: 0 4px 15px rgba(255,255,255,0.2);
    }

    .primary-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255,255,255,0.3);
    }

    .secondary-btn {
        background: rgba(255,255,255,0.1);
        color: #fff;
    }

    .secondary-btn:hover {
        background: rgba(255,255,255,0.15);
    }
</style>
