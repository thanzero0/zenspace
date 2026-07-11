<script>
    /** @type {any} */
    let popups = $state([]);
    /** @type {any} */
    let popupCount = $state(0);
    /** @type {any} */
    let closedCount = $state(0);
    /** @type {any} */
    let autoSpawn = $state(false);
    let spawnInterval;

    const POPUP_MESSAGES = [
        '⚠️ You have 1000 unread emails!',
        '🎉 You won a FREE iPhone!',
        '🔒 Your computer is at risk!',
        '💸 Click here for easy money!',
        '🚨 URGENT: Update required!',
        '✅ Congratulations! You are selected!',
        '🎁 Claim your prize NOW!',
        '📢 LIMITED TIME OFFER!',
        '🛡️ Your antivirus has expired!',
        '🤑 Make $5000 from home!',
    ];

    function spawnPopup() {
        const id = ++popupCount;
        const x = Math.random() * (window.innerWidth - 320);
        const y = Math.random() * (window.innerHeight - 200);
        const msg = POPUP_MESSAGES[Math.floor(Math.random() * POPUP_MESSAGES.length)];
        popups = [...popups, { id, x, y, msg, isDragging: false, startX: 0, startY: 0 }];
    }

    function closePopup(id) /* @type {any} */ {
        popups = popups.filter(p => p.id !== id);
        closedCount++;
    }

    function closeAll() {
        closedCount += popups.length;
        popups = [];
    }

    function toggleAutoSpawn() {
        autoSpawn = !autoSpawn;
        if (autoSpawn) {
            spawnInterval = setInterval(spawnPopup, 1200);
        } else {
            clearInterval(spawnInterval);
        }
    }

    function startDrag(e, popup) /* @type {any} */ {
        popup.isDragging = true;
        popup.startX = e.clientX - popup.x;
        popup.startY = e.clientY - popup.y;
    }

    function onMouseMove(e) /* @type {any} */ {
        popups = popups.map(p => {
            if (p.isDragging) {
                return { ...p, x: e.clientX - p.startX, y: e.clientY - p.startY };
            }
            return p;
        });
    }

    function onMouseUp() {
        popups = popups.map(p => ({ ...p, isDragging: false }));
    }

    import { onDestroy } from 'svelte';
    onDestroy(() => clearInterval(spawnInterval));
</script>

<svelte:head><title>Popup Stressing — Zenspace</title></svelte:head>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="app-container"
    role="application"
    onmousemove={onMouseMove}
    onmouseup={onMouseUp}
>
    <div class="header">
        <div class="brand">🪟 Popup Stressing</div>
        <div class="header-right">
            <span class="stat-badge">Spawned: {popupCount} | Closed: {closedCount} | Open: {popups.length}</span>
            <button class="action-btn" onclick={spawnPopup}>+ Spawn</button>
            <button class="action-btn" class:active={autoSpawn} onclick={toggleAutoSpawn}>
                {autoSpawn ? '⏹ Stop Auto' : '▶ Auto Spawn'}
            </button>
            <button class="action-btn danger" onclick={closeAll}>✕ Close All</button>
            <a href="/" class="home-btn">⌂ Home</a>
        </div>
    </div>

    <div class="workspace">
        <div class="empty-hint">
            Click "+ Spawn" or enable Auto Spawn to create popup windows!
        </div>

        {#each popups as popup (popup.id)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="popup-window"
                style="left: {popup.x}px; top: {popup.y}px; z-index: {popup.isDragging ? 9999 : 100 + popup.id}"
                class:dragging={popup.isDragging}
            >
                <div
                    class="popup-titlebar"
                    onmousedown={(e) => startDrag(e, popup)}
                >
                    <span class="popup-title">Alert #{popup.id}</span>
                    <div class="window-controls">
                        <button class="win-btn minimize">−</button>
                        <button class="win-btn maximize">□</button>
                        <button class="win-btn close" onclick={() => closePopup(popup.id)}>×</button>
                    </div>
                </div>
                <div class="popup-body">
                    <p>{popup.msg}</p>
                    <div class="popup-btns">
                        <button class="popup-ok" onclick={() => closePopup(popup.id)}>OK</button>
                        <button class="popup-cancel" onclick={() => closePopup(popup.id)}>Cancel</button>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #030303;
        color: #e5e5e5;
        font-family: 'Inter', sans-serif;
        overflow: hidden;
        user-select: none;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        flex-shrink: 0;
    }
    .brand { font-size: 16px; font-weight: 700; }
    .header-right { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .stat-badge { font-size: 12px; color: #737373; font-family: 'JetBrains Mono', monospace; }

    .action-btn {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #e5e5e5;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .action-btn:hover { background: rgba(255,255,255,0.12); }
    .action-btn.active { background: rgba(99,102,241,0.2); border-color: #6366f1; color: #a5b4fc; }
    .action-btn.danger { border-color: rgba(239,68,68,0.3); color: #f87171; }
    .action-btn.danger:hover { background: rgba(239,68,68,0.1); }

    .home-btn { color: #a3a3a3; text-decoration: none; font-size: 13px; padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); }

    .workspace {
        flex: 1;
        position: relative;
        overflow: hidden;
    }

    .empty-hint {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #2a2a2a;
        font-size: 16px;
        text-align: center;
        pointer-events: none;
    }

    .popup-window {
        position: absolute;
        width: 300px;
        background: #1a1a2e;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        overflow: hidden;
        transition: box-shadow 0.2s;
    }
    .popup-window.dragging { box-shadow: 0 20px 60px rgba(0,0,0,0.8); cursor: grabbing; }

    .popup-titlebar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #16213e;
        cursor: grab;
        user-select: none;
    }
    .popup-titlebar:active { cursor: grabbing; }
    .popup-title { font-size: 13px; font-weight: 600; color: #a3a3a3; }

    .window-controls { display: flex; gap: 6px; }
    .win-btn {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
    }
    .minimize { background: #f6c90e; color: rgba(0,0,0,0.5); }
    .maximize { background: #6bcb5b; color: rgba(0,0,0,0.5); }
    .close { background: #ff5f57; color: rgba(0,0,0,0.5); }

    .popup-body { padding: 16px 20px 20px; }
    .popup-body p { margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; }
    .popup-btns { display: flex; gap: 8px; justify-content: flex-end; }

    .popup-ok {
        background: #6366f1;
        color: #fff;
        border: none;
        padding: 7px 20px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
    }
    .popup-ok:hover { background: #4f46e5; }
    .popup-cancel {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #a3a3a3;
        padding: 7px 16px;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
    }
</style>
