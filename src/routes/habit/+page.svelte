<script>
    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';

    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const NUM_DAYS = 7;

    /** @type {any} */

    let habits = $state([]);
    /** @type {any} */
    let newHabitText = $state('');

    function getWeekDates() {
        const today = new Date();
        const week = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            week.push(d.toISOString().split('T')[0]);
        }
        return week;
    }

    /** @type {any} */

    let weekDates = $state(getWeekDates());

    function getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }

    function save() {
        localStorage.setItem('zenspace-habits', JSON.stringify(habits));
    }

    function addHabit() {
        if (!newHabitText.trim()) return;
        habits = [...habits, {
            id: Date.now(),
            name: newHabitText.trim(),
            completedDays: {}
        }];
        newHabitText = '';
        save();
    }

    function toggleDay(habitId, dateKey) /* @type {any} */ {
        const habit = habits.find(h => h.id === habitId);
        if (habit.completedDays[dateKey]) {
            delete habit.completedDays[dateKey];
        } else {
            habit.completedDays[dateKey] = true;
        }
        habits = [...habits];
        save();
    }

    function deleteHabit(id) /* @type {any} */ {
        habits = habits.filter(h => h.id !== id);
        save();
    }

    function getStreak(habit) /* @type {any} */ {
        /** @type {any} */
        let streak = $state(0);
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (habit.completedDays[key]) streak++;
            else break;
        }
        return streak;
    }

    function isToday(dateKey) /* @type {any} */ {
        return dateKey === getTodayKey();
    }

    onMount(() => {
        const saved = localStorage.getItem('zenspace-habits');
        if (saved) {
            try { habits = JSON.parse(saved); } catch(e) {}
        }
    });
</script>

<svelte:head>
    <title>Habit Tracker — Zenspace</title>
</svelte:head>

<div class="app-container">
    <div class="header">
        <div class="brand"><em>habit</em> tracker</div>
        <div class="header-right">
            <a href="/" class="home-btn">⌂ Home</a>
            <span class="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
    </div>

    <main>
        <div class="tracker-card">
            <form class="add-habit-section" onsubmit={(e) => { e.preventDefault(); addHabit(); }}>
                <input
                    type="text"
                    class="habit-input"
                    placeholder="Add a new habit..."
                    bind:value={newHabitText}
                    autocomplete="off"
                />
                <button type="submit" class="primary-btn">+ Add</button>
            </form>

            <div class="tracker-table">
                <div class="table-header">
                    <div class="habit-col">Habit</div>
                    <div class="days-row">
                        {#each weekDates as dateKey}
                            <div class="day-header" class:today={isToday(dateKey)}>
                                {DAY_LABELS[new Date(dateKey + 'T00:00:00').getDay()]}
                                <span>{new Date(dateKey + 'T00:00:00').getDate()}</span>
                            </div>
                        {/each}
                    </div>
                    <div class="streak-col">Streak</div>
                    <div class="action-col"></div>
                </div>

                {#if habits.length === 0}
                    <div class="empty-state">No habits yet. Add one above to start tracking!</div>
                {/if}

                {#each habits as habit (habit.id)}
                    <div class="habit-row" transition:slide>
                        <div class="habit-name">{habit.name}</div>
                        <div class="days-row">
                            {#each weekDates as dateKey}
                                <button
                                    class="day-cell"
                                    class:checked={habit.completedDays[dateKey]}
                                    class:today={isToday(dateKey)}
                                    onclick={() => toggleDay(habit.id, dateKey)}
                                    aria-label="Toggle {dateKey}"
                                >
                                    {#if habit.completedDays[dateKey]}✓{/if}
                                </button>
                            {/each}
                        </div>
                        <div class="streak-col">
                            <span class="streak-badge">🔥 {getStreak(habit)}</span>
                        </div>
                        <div class="action-col">
                            <button class="delete-btn" onclick={() => deleteHabit(habit.id)}>✕</button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </main>
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
        padding: 20px 40px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
    }

    .brand {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }

    .brand em {
        font-style: normal;
        color: #a3e635;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .home-btn {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 8px;
        background: rgba(255,255,255,0.05);
        transition: all 0.2s;
    }

    .home-btn:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
    }

    .date-display {
        font-size: 14px;
        color: #a3a3a3;
    }

    main {
        flex: 1;
        padding: 40px;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    .tracker-card {
        background: #0f0f0f;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.06);
        padding: 30px;
    }

    .add-habit-section {
        display: flex;
        gap: 12px;
        margin-bottom: 30px;
    }

    .habit-input {
        flex: 1;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 10px;
        padding: 12px 18px;
        color: #fff;
        font-size: 15px;
        outline: none;
        transition: border-color 0.2s;
        font-family: inherit;
    }

    .habit-input:focus {
        border-color: #a3e635;
    }

    .primary-btn {
        background: #a3e635;
        color: #000;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .primary-btn:hover {
        background: #bef264;
        transform: translateY(-1px);
    }

    .tracker-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .table-header, .habit-row {
        display: grid;
        grid-template-columns: 200px 1fr 80px 40px;
        gap: 10px;
        align-items: center;
    }

    .table-header {
        padding: 0 0 10px 0;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #737373;
    }

    .habit-row {
        padding: 12px;
        border-radius: 10px;
        background: rgba(255,255,255,0.02);
        transition: background 0.2s;
    }

    .habit-row:hover {
        background: rgba(255,255,255,0.05);
    }

    .habit-col, .habit-name {
        font-size: 14px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .days-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
    }

    .day-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 11px;
        color: #737373;
        gap: 2px;
    }

    .day-header span {
        font-size: 13px;
        color: #a3a3a3;
        font-weight: 600;
    }

    .day-header.today span {
        color: #a3e635;
    }

    .day-cell {
        aspect-ratio: 1;
        width: 100%;
        max-width: 36px;
        margin: 0 auto;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.03);
        color: transparent;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .day-cell.today {
        border-color: rgba(163, 230, 53, 0.3);
    }

    .day-cell:hover {
        background: rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.3);
    }

    .day-cell.checked {
        background: #a3e635;
        border-color: #a3e635;
        color: #000;
        font-weight: 700;
    }

    .streak-col {
        text-align: center;
    }

    .streak-badge {
        font-size: 13px;
        font-weight: 600;
        color: #fbbf24;
    }

    .action-col {
        display: flex;
        justify-content: center;
    }

    .delete-btn {
        background: transparent;
        border: none;
        color: #525252;
        cursor: pointer;
        font-size: 14px;
        padding: 4px 8px;
        border-radius: 6px;
        transition: all 0.2s;
    }

    .delete-btn:hover {
        color: #ef4444;
        background: rgba(239,68,68,0.1);
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #525252;
        font-size: 15px;
    }
</style>
