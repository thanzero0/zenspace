<script>
    import { onMount } from 'svelte';
    import { slide, fade } from 'svelte/transition';

    const MOODS = ['😊', '😌', '😐', '😔', '😤'];

    /** @type {any} */

    let entries = $state([]);
    /** @type {any} */
    let activeEntry = $state(null);
    /** @type {any} */
    let isEditing = $state(false);

    // Editor state
    /** @type {any} */
    let editTitle = $state('');
    /** @type {any} */
    let editBody = $state('');
    /** @type {any} */
    let editMood = $state('');

    let wordCount = $derived(editBody.trim() ? editBody.trim().split(/\s+/).length : 0);

    function formatDate(iso) /* @type {any} */ {
        return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function save() {
        localStorage.setItem('zenspace-journal', JSON.stringify(entries));
    }

    function newEntry() {
        activeEntry = null;
        editTitle = '';
        editBody = '';
        editMood = '';
        isEditing = true;
    }

    function openEntry(entry) /* @type {any} */ {
        activeEntry = entry;
        isEditing = false;
    }

    function editCurrent() {
        if (!activeEntry) return;
        editTitle = activeEntry.title;
        editBody = activeEntry.body;
        editMood = activeEntry.mood;
        isEditing = true;
    }

    function saveEntry() {
        if (!editTitle.trim() && !editBody.trim()) return;
        if (activeEntry) {
            // Update existing
            activeEntry.title = editTitle.trim() || 'Untitled';
            activeEntry.body = editBody;
            activeEntry.mood = editMood;
            entries = [...entries];
        } else {
            // New entry
            const entry = {
                id: Date.now(),
                title: editTitle.trim() || 'Untitled',
                body: editBody,
                mood: editMood,
                date: new Date().toISOString()
            };
            entries = [entry, ...entries];
            activeEntry = entry;
        }
        isEditing = false;
        save();
    }

    function deleteEntry() {
        if (!activeEntry) return;
        if (!confirm('Delete this entry?')) return;
        entries = entries.filter(e => e.id !== activeEntry.id);
        activeEntry = null;
        isEditing = false;
        save();
    }

    function setMood(mood) /* @type {any} */ {
        editMood = editMood === mood ? '' : mood;
    }

    onMount(() => {
        const saved = localStorage.getItem('zenspace-journal');
        if (saved) {
            try { entries = JSON.parse(saved); } catch(e) {}
        }
    });
</script>

<svelte:head>
    <title>Daily Journal — Zenspace</title>
</svelte:head>

<div class="app-container">
    <header>
        <div class="brand"><em>daily</em> journal</div>
        <div class="header-right">
            <span class="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            <a href="/" class="home-btn">⌂ Home</a>
        </div>
    </header>

    <div class="layout">
        <!-- Sidebar -->
        <aside>
            <div class="sidebar-top">
                <div class="sidebar-label">All Entries</div>
                <button class="new-btn" onclick={newEntry}>+ New</button>
            </div>

            {#if entries.length === 0}
                <div class="empty-sidebar">No entries yet.</div>
            {:else}
                <ul class="entries-list">
                    {#each entries as entry (entry.id)}
                        <li transition:slide|local>
                            <button
                                class="entry-item {activeEntry?.id === entry.id ? 'active' : ''}"
                                onclick={() => openEntry(entry)}
                            >
                                <div class="entry-item-mood">{entry.mood || '📄'}</div>
                                <div class="entry-item-info">
                                    <div class="entry-item-title">{entry.title}</div>
                                    <div class="entry-item-date">{formatDate(entry.date)}</div>
                                </div>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </aside>

        <!-- Main area -->
        <main>
            {#if isEditing}
                <div class="editor-view" transition:fade|local>
                    <div class="entry-toolbar">
                        <div class="mood-row">
                            <span class="meta-label">Mood</span>
                            <div class="mood-btns">
                                {#each MOODS as mood}
                                    <button
                                        class="mood-btn {editMood === mood ? 'active' : ''}"
                                        onclick={() => setMood(mood)}
                                    >{mood}</button>
                                {/each}
                            </div>
                        </div>
                        <div class="toolbar-actions">
                            {#if activeEntry}
                                <button class="secondary-btn danger" onclick={deleteEntry}>Delete</button>
                            {/if}
                            <button class="secondary-btn" onclick={() => { isEditing = false; }}>Cancel</button>
                            <button class="primary-btn" onclick={saveEntry}>Save</button>
                        </div>
                    </div>

                    <div class="editor-content">
                        <textarea
                            class="title-input"
                            rows="1"
                            placeholder="Entry title…"
                            bind:value={editTitle}
                        ></textarea>
                        <div class="entry-meta-line">
                            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span class="meta-dot">·</span>
                            <span>{wordCount} words</span>
                            {#if editMood}<span class="meta-dot">·</span><span>{editMood}</span>{/if}
                        </div>
                        <textarea
                            class="body-input"
                            placeholder="What are you feeling today?"
                            bind:value={editBody}
                        ></textarea>
                    </div>
                </div>
            {:else if activeEntry}
                <div class="read-view" transition:fade|local>
                    <div class="entry-toolbar">
                        <div></div>
                        <div class="toolbar-actions">
                            <button class="secondary-btn" onclick={editCurrent}>Edit</button>
                            <button class="secondary-btn danger" onclick={deleteEntry}>Delete</button>
                        </div>
                    </div>
                    <div class="read-content">
                        <h1 class="read-title">{activeEntry.title}</h1>
                        <div class="rv-meta">
                            <span>{formatDate(activeEntry.date)}</span>
                            {#if activeEntry.mood}
                                <span class="meta-dot">·</span>
                                <span>{activeEntry.mood}</span>
                            {/if}
                        </div>
                        <div class="rv-body">{activeEntry.body}</div>
                    </div>
                </div>
            {:else}
                <div class="welcome-view" transition:fade|local>
                    <div class="welcome-deco">✦</div>
                    <h2>Welcome back.</h2>
                    <p>Write your thoughts for today.</p>
                    <button class="primary-btn large" onclick={newEntry}>+ New Entry</button>
                </div>
            {/if}
        </main>
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

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 30px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.4);
        backdrop-filter: blur(10px);
    }

    .brand {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .brand em { font-style: normal; color: #c084fc; }

    .header-right {
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .date-display { font-size: 13px; color: #737373; }

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

    .layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        flex: 1;
        overflow: hidden;
    }

    aside {
        border-right: 1px solid rgba(255,255,255,0.06);
        background: rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .sidebar-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .sidebar-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: #737373;
        font-weight: 600;
    }

    .new-btn {
        background: #c084fc;
        color: #000;
        border: none;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .new-btn:hover { background: #d8b4fe; }

    .empty-sidebar {
        padding: 30px 20px;
        color: #525252;
        font-size: 14px;
        text-align: center;
    }

    .entries-list {
        list-style: none;
        padding: 10px;
        margin: 0;
        overflow-y: auto;
        flex: 1;
    }

    .entry-item {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        width: 100%;
        padding: 12px;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #e5e5e5;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
    }
    .entry-item:hover { background: rgba(255,255,255,0.05); }
    .entry-item.active { background: rgba(192,132,252,0.1); border: 1px solid rgba(192,132,252,0.3); }

    .entry-item-mood { font-size: 22px; }

    .entry-item-title {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 170px;
    }

    .entry-item-date { font-size: 11px; color: #737373; margin-top: 2px; }

    /* Main views */
    main { overflow-y: auto; }

    .welcome-view {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 16px;
        color: #525252;
    }

    .welcome-deco { font-size: 40px; }
    .welcome-view h2 { margin: 0; font-size: 24px; color: #a3a3a3; }
    .welcome-view p { margin: 0; font-size: 15px; }

    .entry-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 40px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        position: sticky;
        top: 0;
        background: #030303;
        z-index: 10;
    }

    .mood-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .meta-label { font-size: 12px; color: #737373; }

    .mood-btns { display: flex; gap: 6px; }

    .mood-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .mood-btn:hover { background: rgba(255,255,255,0.1); }
    .mood-btn.active { border-color: #c084fc; background: rgba(192,132,252,0.15); }

    .toolbar-actions { display: flex; gap: 8px; }

    .primary-btn, .secondary-btn {
        padding: 8px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }

    .primary-btn {
        background: #c084fc;
        color: #000;
    }
    .primary-btn:hover { background: #d8b4fe; }
    .primary-btn.large { padding: 12px 28px; font-size: 16px; }

    .secondary-btn {
        background: rgba(255,255,255,0.07);
        color: #e5e5e5;
        border: 1px solid rgba(255,255,255,0.1);
    }
    .secondary-btn:hover { background: rgba(255,255,255,0.12); }
    .secondary-btn.danger { color: #f87171; }
    .secondary-btn.danger:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); }

    .editor-content {
        padding: 30px 40px;
        max-width: 780px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .title-input {
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        color: #fff;
        font-size: 28px;
        font-weight: 700;
        font-family: inherit;
        resize: none;
        letter-spacing: -0.5px;
    }

    .entry-meta-line {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 13px;
        color: #737373;
    }

    .meta-dot { opacity: 0.4; }

    .body-input {
        width: 100%;
        min-height: calc(100vh - 300px);
        background: transparent;
        border: none;
        outline: none;
        color: #d4d4d4;
        font-size: 16px;
        line-height: 1.8;
        font-family: inherit;
        resize: none;
    }

    /* Read view */
    .read-content {
        padding: 30px 40px;
        max-width: 780px;
        margin: 0 auto;
    }

    .read-title {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin: 0 0 12px 0;
    }

    .rv-meta {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 13px;
        color: #737373;
        margin-bottom: 30px;
    }

    .rv-body {
        font-size: 16px;
        line-height: 1.8;
        color: #d4d4d4;
        white-space: pre-wrap;
    }
</style>
