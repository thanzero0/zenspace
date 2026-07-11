<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    /** @type {any} */

    let tabs = $state([{ id: 1, name: 'Untitled 1', content: '' }]);
    /** @type {any} */
    let activeTabId = $state(1);
    
    /** @type {any} */
    
    let wordCount = $state(0);
    /** @type {any} */
    let lineCount = $state(1);
    /** @type {any} */
    let colCount = $state(1);
    let textareaElement;
    
    // Derived value for current tab content
    let activeTab = $derived(tabs.find(t => t.id === activeTabId) || tabs[0]);
    
    function updateStats() {
        if (!activeTab) return;
        const text = activeTab.content;
        
        // Word count
        const words = text.trim().split(/\s+/);
        wordCount = text.trim() === '' ? 0 : words.length;

        // Line and Col
        if (textareaElement) {
            const cursorPosition = textareaElement.selectionStart;
            const textBeforeCursor = text.substring(0, cursorPosition);
            const linesBeforeCursor = textBeforeCursor.split('\n');
            lineCount = linesBeforeCursor.length;
            colCount = linesBeforeCursor[linesBeforeCursor.length - 1].length + 1;
        }
    }

    function handleInput() {
        updateStats();
        saveToLocal();
    }

    function saveToLocal() {
        localStorage.setItem('zenspace-notepad-tabs', JSON.stringify(tabs));
        localStorage.setItem('zenspace-notepad-active', activeTabId);
    }

    function addTab() {
        const newId = Date.now();
        tabs = [...tabs, { id: newId, name: `Untitled ${tabs.length + 1}`, content: '' }];
        activeTabId = newId;
        saveToLocal();
    }

    function closeTab(id) /* @type {any} */ {
        if (tabs.length === 1) {
            tabs[0].content = '';
            tabs[0].name = 'Untitled 1';
        } else {
            tabs = tabs.filter(t => t.id !== id);
            if (activeTabId === id) {
                activeTabId = tabs[0].id;
            }
        }
        saveToLocal();
    }

    function renameTab(id) /* @type {any} */ {
        const tab = tabs.find(t => t.id === id);
        const newName = prompt('New name:', tab.name);
        if (newName && newName.trim()) {
            tab.name = newName.trim();
            tabs = [...tabs];
            saveToLocal();
        }
    }

    function downloadFile() {
        const element = document.createElement('a');
        const file = new Blob([activeTab.content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${activeTab.name}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    onMount(() => {
        const savedTabs = localStorage.getItem('zenspace-notepad-tabs');
        const savedActive = localStorage.getItem('zenspace-notepad-active');
        if (savedTabs) {
            try {
                tabs = JSON.parse(savedTabs);
                if (savedActive) activeTabId = parseInt(savedActive);
                
                if (!tabs.find(t => t.id === activeTabId)) {
                    activeTabId = tabs[0].id;
                }
            } catch (e) {
                console.error("Could not load tabs", e);
            }
        }
        updateStats();
    });
</script>

<div class="app-container">
    <div class="header">
        <a href="/" class="home-btn">⌂ Home</a>
        <div class="tabs-container">
            {#each tabs as tab}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <div 
                    class="tab {tab.id === activeTabId ? 'active' : ''}" 
                    role="button" tabindex="0"
                    onclick={() => { activeTabId = tab.id; setTimeout(updateStats, 10); }}
                    ondblclick={() => renameTab(tab.id)}
                >
                    {tab.name}
                    <button class="close-btn" on:click|stopPropagation={() => closeTab(tab.id)}>×</button>
                </div>
            {/each}
            <button class="add-tab-btn" onclick={addTab}>+</button>
        </div>
        <button class="action-btn" onclick={downloadFile} title="Download">↓ Download</button>
    </div>

    <div class="editor-container">
        <textarea 
            bind:this={textareaElement}
            bind:value={activeTab.content} 
            oninput={handleInput}
            onclick={updateStats}
            onkeyup={updateStats}
            placeholder="Start writing..."
            spellcheck="false"
        ></textarea>
    </div>

    <div class="statusbar">
        <div class="status-left">
            <span>{wordCount} words</span>
        </div>
        <div class="status-right">
            <span>Ln {lineCount}, Col {colCount}</span>
        </div>
    </div>
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        background: #030303;
        color: #e5e5e5;
        font-family: 'Inter', sans-serif;
    }

    .header {
        display: flex;
        align-items: center;
        background: #0a0a0a;
        padding: 0 16px;
        height: 48px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        gap: 16px;
    }

    .home-btn {
        color: #a3a3a3;
        text-decoration: none;
        font-size: 14px;
        padding: 6px 12px;
        border-radius: 6px;
        transition: background 0.2s;
    }

    .home-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }

    .tabs-container {
        display: flex;
        flex: 1;
        overflow-x: auto;
        gap: 2px;
        height: 100%;
        align-items: flex-end;
    }

    .tabs-container::-webkit-scrollbar { display: none; }

    .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px 8px 0 0;
        font-size: 13px;
        color: #a3a3a3;
        cursor: pointer;
        min-width: 120px;
        max-width: 200px;
        user-select: none;
        border: 1px solid transparent;
        border-bottom: none;
    }

    .tab:hover {
        background: rgba(255, 255, 255, 0.08);
    }

    .tab.active {
        background: #141414;
        color: #fff;
        border-color: rgba(255, 255, 255, 0.1);
    }

    .close-btn {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 16px;
        cursor: pointer;
        padding: 0 4px;
        opacity: 0.5;
        margin-left: auto;
    }
    
    .close-btn:hover {
        opacity: 1;
        color: #ef4444;
    }

    .add-tab-btn {
        background: transparent;
        border: none;
        color: #a3a3a3;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 12px;
        margin-bottom: 4px;
    }

    .add-tab-btn:hover {
        color: #fff;
    }

    .action-btn {
        background: #262626;
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #e5e5e5;
        padding: 6px 16px;
        border-radius: 6px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .action-btn:hover {
        background: #333;
        border-color: rgba(255, 255, 255, 0.2);
    }

    .editor-container {
        flex: 1;
        padding: 24px 40px;
        background: #141414;
        display: flex;
        justify-content: center;
        overflow-y: auto;
    }

    textarea {
        width: 100%;
        max-width: 800px;
        height: 100%;
        min-height: calc(100vh - 150px);
        background: transparent;
        border: none;
        color: #e5e5e5;
        font-family: 'JetBrains Mono', monospace;
        font-size: 15px;
        line-height: 1.6;
        resize: none;
        outline: none;
    }

    .statusbar {
        display: flex;
        justify-content: space-between;
        padding: 4px 20px;
        background: #0a0a0a;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 12px;
        color: #737373;
        font-family: 'JetBrains Mono', monospace;
    }
</style>
