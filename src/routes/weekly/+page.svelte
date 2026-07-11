<script>
    import { onMount } from 'svelte';

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const HOURS = Array.from({ length: 14 }, (_, i) => `${i + 7}:00`); // 7:00 - 20:00

    /** @type {any} */

    let events = $state({});
    /** @type {any} */
    let dragging = $state(null);
    /** @type {any} */
    let isAdding = $state(false);
    /** @type {any} */
    let newEvent = $state({ day: 'Monday', hour: '9:00', title: '', color: '#6366f1', duration: 1 });

    function save() { localStorage.setItem('zenspace-weekly', JSON.stringify(events)); }

    function addEvent() {
        if (!newEvent.title.trim()) return;
        const key = `${newEvent.day}-${newEvent.hour}`;
        if (!events[key]) events[key] = [];
        events[key] = [...events[key], { id: Date.now(), ...newEvent }];
        events = { ...events };
        newEvent = { day: 'Monday', hour: '9:00', title: '', color: '#6366f1', duration: 1 };
        isAdding = false;
        save();
    }

    function deleteEvent(key, id) /* @type {any} */ {
        events[key] = events[key].filter(e => e.id !== id);
        if (events[key].length === 0) delete events[key];
        events = { ...events };
        save();
    }

    function getEventsForSlot(day, hour) /* @type {any} */ {
        return events[`${day}-${hour}`] || [];
    }

    onMount(() => {
        const saved = localStorage.getItem('zenspace-weekly');
        if (saved) { try { events = JSON.parse(saved); } catch(e) {} }
    });
</script>

<svelte:head><title>Weekly Planner — Zenspace</title></svelte:head>

<div class="app-container">
    <div class="header">
        <div class="brand">📅 Weekly Planner</div>
        <div class="header-right">
            <button class="add-btn" onclick={() => isAdding = !isAdding}>+ Add Event</button>
            <a href="/" class="home-btn">⌂ Home</a>
        </div>
    </div>

    {#if isAdding}
        <div class="add-panel">
            <form class="add-form" onsubmit={(e) => { e.preventDefault(); addEvent(); }}>
                <label>Title <input type="text" bind:value={newEvent.title} placeholder="Meeting, workout..." required></label>
                <label>Day
                    <select bind:value={newEvent.day}>
                        {#each DAYS as day}<option value={day}>{day}</option>{/each}
                    </select>
                </label>
                <label>Time
                    <select bind:value={newEvent.hour}>
                        {#each HOURS as hour}<option value={hour}>{hour}</option>{/each}
                    </select>
                </label>
                <label>Color <input type="color" bind:value={newEvent.color}></label>
                <div class="form-actions">
                    <button type="button" class="cancel-btn" onclick={() => isAdding = false}>Cancel</button>
                    <button type="submit" class="primary-btn">Add</button>
                </div>
            </form>
        </div>
    {/if}

    <div class="planner-scroll">
        <div class="planner-grid">
            <!-- Header row -->
            <div class="time-col-header"></div>
            {#each DAYS as day}
                <div class="day-header">{day.slice(0, 3)}</div>
            {/each}

            <!-- Time rows -->
            {#each HOURS as hour}
                <div class="time-label">{hour}</div>
                {#each DAYS as day}
                    <div class="time-slot">
                        {#each getEventsForSlot(day, hour) as event (event.id)}
                            <div class="event-chip" style="background: {event.color}20; border-left: 3px solid {event.color}">
                                <span class="event-title">{event.title}</span>
                                <button class="del-event" onclick={() => deleteEvent(`${day}-${hour}`, event.id)}>×</button>
                            </div>
                        {/each}
                    </div>
                {/each}
            {/each}
        </div>
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
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.3);
        flex-shrink: 0;
    }
    .brand { font-size: 16px; font-weight: 700; }
    .header-right { display: flex; gap: 10px; }

    .add-btn {
        background: #fff; color: #000; border: none;
        padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    }
    .home-btn {
        color: #a3a3a3; text-decoration: none; font-size: 13px;
        padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.05);
    }

    .add-panel {
        background: #0f0f0f;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        padding: 16px 24px;
        flex-shrink: 0;
    }

    .add-form {
        display: flex;
        gap: 14px;
        align-items: flex-end;
        flex-wrap: wrap;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 11px;
        color: #737373;
    }

    input[type="text"], input[type="number"], select {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 7px 12px;
        color: #fff;
        font-size: 13px;
        outline: none;
        font-family: inherit;
    }

    input[type="color"] {
        width: 44px; height: 32px;
        border: none; border-radius: 6px; cursor: pointer; background: transparent;
    }

    .form-actions { display: flex; gap: 8px; align-items: center; }

    .primary-btn { background: #fff; color: #000; border: none; padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
    .cancel-btn { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); color: #e5e5e5; padding: 7px 14px; border-radius: 8px; font-size: 13px; cursor: pointer; }

    .planner-scroll {
        flex: 1;
        overflow: auto;
    }

    .planner-grid {
        display: grid;
        grid-template-columns: 60px repeat(7, 1fr);
        min-width: 900px;
    }

    .time-col-header, .day-header {
        padding: 12px 8px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        background: rgba(0,0,0,0.4);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        color: #737373;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .time-label {
        font-size: 11px;
        color: #525252;
        padding: 8px 8px 0 8px;
        border-right: 1px solid rgba(255,255,255,0.04);
        font-family: 'JetBrains Mono', monospace;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
    }

    .time-slot {
        border-right: 1px solid rgba(255,255,255,0.04);
        border-bottom: 1px solid rgba(255,255,255,0.04);
        padding: 4px;
        min-height: 52px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        transition: background 0.15s;
    }
    .time-slot:hover { background: rgba(255,255,255,0.02); }

    .event-chip {
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
    }
    .event-title { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .del-event {
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.4);
        cursor: pointer;
        font-size: 14px;
        padding: 0;
        line-height: 1;
        flex-shrink: 0;
    }
    .del-event:hover { color: #ef4444; }
</style>
