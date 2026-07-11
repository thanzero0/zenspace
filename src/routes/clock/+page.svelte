<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    /** @type {any} */

    let timeString = $state('');
    /** @type {any} */
    let dateString = $state('');
    
    /** @type {any} */
    
    let showDate = $state(true);
    /** @type {any} */
    let format24h = $state(true);
    let precision = 'hms'; // h, hm, hms
    /** @type {any} */
    let isSettingsOpen = $state(false);

    function updateTime() {
        const now = new Date();
        
        /** @type {any} */
        
        let hours = $state(now.getHours());
        /** @type {any} */
        let minutes = $state(now.getMinutes());
        /** @type {any} */
        let seconds = $state(now.getSeconds());

        if (!format24h) {
            hours = hours % 12 || 12;
        }

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');

        if (precision === 'h') timeString = `${hours}`;
        else if (precision === 'hm') timeString = `${hours}:${minutes}`;
        else timeString = `${hours}:${minutes}:${seconds}`;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateString = now.toLocaleDateString('en-US', options).toUpperCase();
    }

    onMount(() => {
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });
</script>

<div class="app-container">
    <div class="controls-row">
        <button class="toggle-btn" onclick={() => isSettingsOpen = !isSettingsOpen}>
            ⚙ Settings
        </button>
        <a href="/" class="toggle-btn home-btn">⌂ Home</a>
    </div>

    {#if isSettingsOpen}
        <div class="settings-panel" transition:fade>
            <div class="setting-item">
                <span class="setting-label">Show Date</span>
                <label class="switch">
                    <input type="checkbox" bind:checked={showDate}>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="setting-item">
                <span class="setting-label">24H Format</span>
                <label class="switch">
                    <input type="checkbox" bind:checked={format24h}>
                    <span class="slider"></span>
                </label>
            </div>

            <div class="setting-group">
                <span class="setting-label">Precision</span>
                <div class="segmented-control">
                    <button class="segment" class:active={precision === 'h'} onclick={() => precision = 'h'}>H</button>
                    <button class="segment" class:active={precision === 'hm'} onclick={() => precision = 'hm'}>M</button>
                    <button class="segment" class:active={precision === 'hms'} onclick={() => precision = 'hms'}>S</button>
                </div>
            </div>
        </div>
    {/if}

    <div class="clock-wrapper">
        <div class="time">{timeString}</div>
        {#if showDate}
            <div class="date" transition:fade>{dateString}</div>
        {/if}
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
        background: #030712;
        color: #10b981;
        font-family: 'JetBrains Mono', monospace;
    }

    .controls-row {
        position: absolute;
        top: 30px;
        left: 30px;
        display: flex;
        gap: 12px;
        z-index: 100;
    }

    .toggle-btn {
        padding: 10px 20px;
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        background: rgba(17, 24, 39, 0.8);
        color: #10b981;
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        backdrop-filter: blur(10px);
        transition: all 0.2s ease;
    }

    .toggle-btn:hover {
        background: #10b981;
        color: #030712;
    }

    .settings-panel {
        position: absolute;
        top: 80px;
        left: 30px;
        background: rgba(17, 24, 39, 0.9);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 16px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        backdrop-filter: blur(10px);
        z-index: 99;
    }

    .setting-item, .setting-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 24px;
    }

    .setting-label {
        font-size: 14px;
        font-weight: 500;
    }

    .clock-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }

    .time {
        font-size: 15vw;
        font-weight: 700;
        line-height: 1;
        text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        letter-spacing: -0.05em;
    }

    .date {
        font-size: 2vw;
        letter-spacing: 0.2em;
        opacity: 0.8;
    }

    /* Switch */
    .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
    }
    
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(16, 185, 129, 0.2);
        transition: .4s;
        border-radius: 24px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: #10b981;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: rgba(16, 185, 129, 0.5);
    }

    input:checked + .slider:before {
        transform: translateX(20px);
        background-color: #10b981;
    }

    /* Segmented Control */
    .segmented-control {
        display: flex;
        background: rgba(16, 185, 129, 0.1);
        border-radius: 8px;
        padding: 4px;
        gap: 4px;
    }

    .segment {
        padding: 6px 12px;
        border: none;
        background: transparent;
        color: #10b981;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
    }

    .segment.active {
        background: #10b981;
        color: #030712;
    }
</style>
