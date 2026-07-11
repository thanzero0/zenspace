<script>
    import { fade } from 'svelte/transition';

    /** @type {any} */

    let isFlipping = $state(false);
    /** @type {any} */
    let result = $state(null);
    /** @type {any} */
    let totalHeads = $state(0);
    /** @type {any} */
    let totalTails = $state(0);
    /** @type {any} */
    let rotation = $state(0);

    function flip() {
        if (isFlipping) return;
        isFlipping = true;
        result = null;
        rotation += 1440 + Math.random() * 360;

        setTimeout(() => {
            const coin = Math.random() < 0.5 ? 'heads' : 'tails';
            result = coin;
            if (coin === 'heads') totalHeads++;
            else totalTails++;
            isFlipping = false;
        }, 800);
    }

    function reset() {
        result = null;
        totalHeads = 0;
        totalTails = 0;
    }
</script>

<svelte:head><title>Coin Flip — Zenspace</title></svelte:head>

<div class="app-container">
    <div class="header">
        <div class="brand">🪙 Coin Flip</div>
        <a href="/" class="home-btn">⌂ Home</a>
    </div>

    <div class="main">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="coin"
            class:heads={result === 'heads'}
            class:tails={result === 'tails'}
            class:flipping={isFlipping}
            onclick={flip}
            style="transform: rotateY({rotation}deg)"
        >
            <div class="coin-face coin-heads">
                <span>🦅</span>
                <div class="coin-label">HEADS</div>
            </div>
            <div class="coin-face coin-tails">
                <span>🏛️</span>
                <div class="coin-label">TAILS</div>
            </div>
        </div>

        {#if result}
            <div class="result" transition:fade>
                <span class="result-text {result}">{result.toUpperCase()}!</span>
            </div>
        {:else if !isFlipping}
            <div class="hint" transition:fade>Click the coin to flip</div>
        {/if}

        <div class="stats">
            <div class="stat">
                <div class="stat-val heads-color">{totalHeads}</div>
                <div class="stat-label">Heads</div>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat">
                <div class="stat-val tails-color">{totalTails}</div>
                <div class="stat-label">Tails</div>
            </div>
            <div class="stat-divider">|</div>
            <div class="stat">
                <div class="stat-val">{totalHeads + totalTails}</div>
                <div class="stat-label">Total</div>
            </div>
        </div>

        {#if totalHeads + totalTails > 0}
            <button class="reset-btn" onclick={reset}>↺ Reset Stats</button>
        {/if}
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
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 30px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.3);
    }
    .brand { font-size: 18px; font-weight: 700; }

    .home-btn {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 13px;
        padding: 6px 14px;
        border-radius: 8px;
        background: rgba(255,255,255,0.05);
    }
    .home-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .main {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30px;
        padding: 40px;
    }

    .coin {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        cursor: pointer;
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .coin:hover { filter: brightness(1.1); }

    .coin-face {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 60px;
    }

    .coin-heads {
        background: radial-gradient(circle at 35% 35%, #f6e68a, #c8a923);
        border: 6px solid #d4a017;
    }

    .coin-tails {
        background: radial-gradient(circle at 35% 35%, #d0d0d0, #888);
        border: 6px solid #999;
        transform: rotateY(180deg);
    }

    .coin-label {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 2px;
        color: rgba(0,0,0,0.5);
    }

    .result {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
    }

    .result-text.heads { color: #f6e68a; }
    .result-text.tails { color: #d0d0d0; }

    .hint { color: #525252; font-size: 15px; }

    .stats {
        display: flex;
        align-items: center;
        gap: 24px;
        background: rgba(255,255,255,0.04);
        padding: 20px 40px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.06);
    }

    .stat { text-align: center; }
    .stat-val { font-size: 32px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
    .stat-label { font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .stat-divider { color: rgba(255,255,255,0.1); font-size: 24px; }
    .heads-color { color: #f6e68a; }
    .tails-color { color: #a3a3a3; }

    .reset-btn {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #a3a3a3;
        padding: 10px 24px;
        border-radius: 10px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .reset-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
</style>
