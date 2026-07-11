<script>
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';

    /** @type {any} */

    let goals = $state([]);
    /** @type {any} */
    let isAdding = $state(false);
    /** @type {any} */
    let newGoal = $state({ title: '', target: '', current: 0, unit: '', deadline: '', color: '#6366f1' });

    function save() { localStorage.setItem('zenspace-goals', JSON.stringify(goals)); }

    function addGoal() {
        if (!newGoal.title.trim() || !newGoal.target) return;
        goals = [...goals, { ...newGoal, id: Date.now(), target: parseFloat(newGoal.target), current: parseFloat(newGoal.current) || 0 }];
        newGoal = { title: '', target: '', current: 0, unit: '', deadline: '', color: '#6366f1' };
        isAdding = false;
        save();
    }

    function updateProgress(goal, delta) /* @type {any} */ {
        goal.current = Math.max(0, Math.min(goal.target, goal.current + delta));
        goals = [...goals];
        save();
    }

    function setProgress(goal, val) /* @type {any} */ {
        goal.current = Math.max(0, Math.min(goal.target, parseFloat(val) || 0));
        goals = [...goals];
        save();
    }

    function deleteGoal(id) /* @type {any} */ {
        if (confirm('Delete this goal?')) { goals = goals.filter(g => g.id !== id); save(); }
    }

    function getPercent(goal) /* @type {any} */ { return Math.round((goal.current / goal.target) * 100); }

    function daysLeft(deadline) /* @type {any} */ {
        if (!deadline) return null;
        const diff = new Date(deadline) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    onMount(() => {
        const saved = localStorage.getItem('zenspace-goals');
        if (saved) { try { goals = JSON.parse(saved); } catch(e) {} }
    });
</script>

<svelte:head><title>Goal Tracker — Zenspace</title></svelte:head>

<div class="app-container">
    <div class="header">
        <div class="brand">🎯 Goal Tracker</div>
        <div class="header-right">
            <button class="add-btn" onclick={() => isAdding = !isAdding}>+ New Goal</button>
            <a href="/" class="home-btn">⌂ Home</a>
        </div>
    </div>

    <div class="main">
        {#if isAdding}
            <div class="add-panel" transition:slide>
                <h3>New Goal</h3>
                <form onsubmit={(e) => { e.preventDefault(); addGoal(); }} class="goal-form">
                    <div class="form-row">
                        <label>Goal Title <input type="text" bind:value={newGoal.title} placeholder="e.g. Read 12 books" required></label>
                        <label>Color <input type="color" bind:value={newGoal.color}></label>
                    </div>
                    <div class="form-row">
                        <label>Target <input type="number" bind:value={newGoal.target} placeholder="e.g. 12" min="1" required></label>
                        <label>Unit <input type="text" bind:value={newGoal.unit} placeholder="e.g. books, km, pages"></label>
                        <label>Deadline <input type="date" bind:value={newGoal.deadline}></label>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="cancel-btn" onclick={() => isAdding = false}>Cancel</button>
                        <button type="submit" class="primary-btn">Create Goal</button>
                    </div>
                </form>
            </div>
        {/if}

        {#if goals.length === 0 && !isAdding}
            <div class="empty-state">
                <div class="empty-icon">🎯</div>
                <h2>No goals yet</h2>
                <p>Set your first goal to start tracking your progress</p>
                <button class="primary-btn" onclick={() => isAdding = true}>+ Add First Goal</button>
            </div>
        {:else}
            <div class="goals-grid">
                {#each goals as goal (goal.id)}
                    {@const pct = getPercent(goal)}
                    {@const days = daysLeft(goal.deadline)}
                    <div class="goal-card" style="--goal-color: {goal.color}" transition:slide|local>
                        <div class="goal-header">
                            <h3 class="goal-title">{goal.title}</h3>
                            <button class="delete-btn" onclick={() => deleteGoal(goal.id)}>✕</button>
                        </div>

                        <div class="progress-ring-container">
                            <svg width="120" height="120">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="10"/>
                                <circle cx="60" cy="60" r="50" fill="none"
                                    stroke={goal.color}
                                    stroke-width="10"
                                    stroke-dasharray="{50 * 2 * Math.PI}"
                                    stroke-dashoffset="{50 * 2 * Math.PI * (1 - pct/100)}"
                                    style="transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.5s ease;"
                                />
                            </svg>
                            <div class="progress-center">
                                <span class="pct-text">{pct}%</span>
                            </div>
                        </div>

                        <div class="progress-nums">
                            <input
                                type="number"
                                class="current-input"
                                value={goal.current}
                                min="0" max={goal.target}
                                onchange={(e) => setProgress(goal, e.target.value)}
                                style="color: {goal.color}"
                            >
                            <span class="separator">/</span>
                            <span class="target">{goal.target} {goal.unit}</span>
                        </div>

                        <div class="stepper">
                            <button class="step-btn" onclick={() => updateProgress(goal, -1)}>−</button>
                            <button class="step-btn" onclick={() => updateProgress(goal, 1)}>+</button>
                        </div>

                        {#if days !== null}
                            <div class="deadline" class:overdue={days < 0} class:soon={days <= 7 && days >= 0}>
                                {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today!' : `${days}d left`}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
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
    .header-right { display: flex; gap: 12px; align-items: center; }

    .add-btn {
        background: #fff;
        color: #000;
        border: none;
        padding: 8px 18px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
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

    .main { padding: 30px; }

    .add-panel {
        background: #111;
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 24px;
    }
    .add-panel h3 { margin: 0 0 20px 0; font-size: 16px; }

    .goal-form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: flex; gap: 16px; }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12px;
        color: #737373;
        flex: 1;
    }

    input[type="text"], input[type="number"], input[type="date"] {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 8px 12px;
        color: #fff;
        font-size: 14px;
        outline: none;
        font-family: inherit;
    }

    input[type="color"] {
        width: 50px;
        height: 36px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        background: transparent;
    }

    .form-actions { display: flex; gap: 10px; justify-content: flex-end; }

    .primary-btn {
        background: #fff;
        color: #000;
        border: none;
        padding: 10px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .primary-btn:hover { background: #e5e5e5; }

    .cancel-btn {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #e5e5e5;
        padding: 10px 18px;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        gap: 16px;
        text-align: center;
        color: #525252;
    }
    .empty-icon { font-size: 48px; }
    .empty-state h2 { margin: 0; color: #a3a3a3; font-size: 24px; }
    .empty-state p { margin: 0; font-size: 15px; }

    .goals-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }

    .goal-card {
        background: #0f0f0f;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 20px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        position: relative;
        border-top: 3px solid var(--goal-color);
        transition: transform 0.2s;
    }
    .goal-card:hover { transform: translateY(-2px); }

    .goal-header { width: 100%; display: flex; justify-content: space-between; align-items: flex-start; }
    .goal-title { margin: 0; font-size: 16px; font-weight: 600; }
    .delete-btn { background: transparent; border: none; color: #525252; cursor: pointer; font-size: 14px; padding: 4px; }
    .delete-btn:hover { color: #ef4444; }

    .progress-ring-container { position: relative; display: flex; justify-content: center; align-items: center; }
    .progress-center { position: absolute; display: flex; justify-content: center; align-items: center; }
    .pct-text { font-size: 20px; font-weight: 700; }

    .progress-nums { display: flex; align-items: center; gap: 8px; }
    .current-input {
        width: 60px;
        background: transparent;
        border: none;
        font-size: 22px;
        font-weight: 700;
        text-align: right;
        outline: none;
        font-family: 'JetBrains Mono', monospace;
    }
    .separator { color: #525252; font-size: 18px; }
    .target { font-size: 15px; color: #737373; }

    .stepper { display: flex; gap: 12px; }
    .step-btn {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .step-btn:hover { background: rgba(255,255,255,0.15); }

    .deadline {
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 20px;
        background: rgba(255,255,255,0.05);
        color: #737373;
    }
    .deadline.soon { background: rgba(251,191,36,0.1); color: #fbbf24; }
    .deadline.overdue { background: rgba(239,68,68,0.1); color: #f87171; }
</style>
