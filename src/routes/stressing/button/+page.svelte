<script>
    /** @type {any} */
    let count = $state(0);
    /** @type {any} */
    let maxCombo = $state(0);
    /** @type {any} */
    let combo = $state(0);
    /** @type {any} */
    let lastClickTime = $state(0);
    let comboTimeout;
    /** @type {any} */
    let ripples = $state([]);
    /** @type {any} */
    let isRaging = $state(false);

    function handleClick(e) /* @type {any} */ {
        count++;
        combo++;

        if (combo > maxCombo) maxCombo = combo;

        // Ripple effect
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        ripples = [...ripples, { id, x, y }];
        setTimeout(() => { ripples = ripples.filter(r => r.id !== id); }, 600);

        // Combo reset timer
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(() => { combo = 0; }, 1000);

        // Rage mode
        if (combo >= 20) isRaging = true;
        else isRaging = false;
    }

    function reset() {
        count = 0;
        combo = 0;
        maxCombo = 0;
        isRaging = false;
        ripples = [];
    }

    let buttonColor = $derived(combo > 30 ? '#ef4444' : combo > 15 ? '#f97316' : combo > 5 ? '#eab308' : '#fff');
    let buttonLabel = $derived(combo > 30 ? '🔥 RAGE!' : combo > 15 ? '⚡ COMBO!' : combo > 5 ? '✨ Nice!' : 'PRESS ME');
</script>

<svelte:head><title>Button Stressing — Zenspace</title></svelte:head>

<div class="app-container" class:raging={isRaging}>
    <div class="header">
        <div class="brand">🖱️ Button Stressing</div>
        <a href="/" class="home-btn">⌂ Home</a>
    </div>

    <div class="main">
        <div class="stats-row">
            <div class="stat">
                <div class="stat-val">{count}</div>
                <div class="stat-lbl">Clicks</div>
            </div>
            <div class="stat">
                <div class="stat-val" style="color: {buttonColor}">{combo}×</div>
                <div class="stat-lbl">Combo</div>
            </div>
            <div class="stat">
                <div class="stat-val">{maxCombo}×</div>
                <div class="stat-lbl">Max Combo</div>
            </div>
        </div>

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="button-area" onclick={handleClick}>
            <button
                class="stress-btn"
                style="background: {buttonColor}; box-shadow: 0 0 {combo * 3}px {buttonColor}"
                on:click|stopPropagation={handleClick}
            >
                {buttonLabel}
            </button>
            {#each ripples as ripple (ripple.id)}
                <div class="ripple" style="left: {ripple.x}px; top: {ripple.y}px; border-color: {buttonColor}"></div>
            {/each}
        </div>

        <button class="reset-btn" onclick={reset}>↺ Reset</button>
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
        transition: background 0.3s;
    }
    .app-container.raging { background: #0a0000; }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 30px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .brand { font-size: 18px; font-weight: 700; }
    .home-btn { color: #a3a3a3; text-decoration: none; font-size: 13px; padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); }
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

    .stats-row { display: flex; gap: 40px; }
    .stat { text-align: center; }
    .stat-val { font-size: 40px; font-weight: 700; font-family: 'JetBrains Mono', monospace; transition: color 0.3s; }
    .stat-lbl { font-size: 12px; color: #525252; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

    .button-area {
        position: relative;
        width: 300px;
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .stress-btn {
        width: 200px;
        height: 200px;
        border-radius: 50%;
        border: none;
        font-size: 18px;
        font-weight: 800;
        cursor: pointer;
        color: #000;
        transition: background 0.2s, box-shadow 0.2s, transform 0.05s;
        letter-spacing: 1px;
        z-index: 1;
    }
    .stress-btn:active { transform: scale(0.93); }

    .ripple {
        position: absolute;
        width: 0;
        height: 0;
        border-radius: 50%;
        border: 2px solid;
        animation: ripple-anim 0.6s ease-out forwards;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }

    @keyframes ripple-anim {
        from { width: 0; height: 0; opacity: 1; }
        to { width: 200px; height: 200px; opacity: 0; }
    }

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
    .reset-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }
</style>
