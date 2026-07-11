<script>
    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';

    let boards = [
        { id: 1, title: 'Main Tasks', tasks: [{ id: 1, text: 'Welcome to Zenspace To-Do', completed: false }] }
    ];

    /** @type {any} */

    let newBoardTitle = $state('');
    /** @type {any} */
    let isAddingBoard = $state(false);

    // Helper to auto-focus inputs when shown
    function focusInput(node) /* @type {any} */ {
        node.focus();
    }

    function saveToLocal() {
        localStorage.setItem('zenspace-todo-boards', JSON.stringify(boards));
    }

    function addBoard() {
        if (!newBoardTitle.trim()) {
            isAddingBoard = false;
            return;
        }
        boards = [...boards, {
            id: Date.now(),
            title: newBoardTitle.trim(),
            tasks: [],
            newTaskText: ''
        }];
        newBoardTitle = '';
        isAddingBoard = false;
        saveToLocal();
    }

    function deleteBoard(id) /* @type {any} */ {
        if (confirm('Delete this board?')) {
            boards = boards.filter(b => b.id !== id);
            saveToLocal();
        }
    }

    function addTask(boardId, e) /* @type {any} */ {
        const board = boards.find(b => b.id === boardId);
        if (!board.newTaskText || !board.newTaskText.trim()) return;

        board.tasks = [...board.tasks, {
            id: Date.now(),
            text: board.newTaskText.trim(),
            completed: false
        }];
        board.newTaskText = '';
        boards = [...boards];
        saveToLocal();
    }

    function toggleTask(boardId, taskId) /* @type {any} */ {
        const board = boards.find(b => b.id === boardId);
        const task = board.tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        boards = [...boards];
        saveToLocal();
    }

    function deleteTask(boardId, taskId) /* @type {any} */ {
        const board = boards.find(b => b.id === boardId);
        board.tasks = board.tasks.filter(t => t.id !== taskId);
        boards = [...boards];
        saveToLocal();
    }

    onMount(() => {
        const saved = localStorage.getItem('zenspace-todo-boards');
        if (saved) {
            try {
                boards = JSON.parse(saved);
                // Ensure legacy boards have newTaskText
                boards.forEach(b => { if (b.newTaskText === undefined) b.newTaskText = ''; });
            } catch(e) {}
        }
    });
</script>

<div class="app-container">
    <div class="header">
        <a href="/" class="home-btn">⌂ Home</a>
        <h1 class="page-title">To-Do Boards</h1>
    </div>

    <div class="boards-scroll-container">
        {#each boards as board (board.id)}
            <div class="board" transition:fade>
                <div class="board-header">
                    <h3 class="board-title">{board.title}</h3>
                    <button class="icon-btn danger" onclick={() => deleteBoard(board.id)}>✕</button>
                </div>

                <div class="tasks-list">
                    {#each board.tasks as task (task.id)}
                        <div class="task-item" class:completed={task.completed} transition:slide|local>
                            <label class="checkbox-container">
                                <input type="checkbox" checked={task.completed} onchange={() => toggleTask(board.id, task.id)}>
                                <span class="checkmark"></span>
                            </label>
                            <span class="task-text">{task.text}</span>
                            <button class="icon-btn delete-task" onclick={() => deleteTask(board.id, task.id)}>✕</button>
                        </div>
                    {/each}
                </div>

                <form class="add-task-form" onsubmit={(e) => { e.preventDefault(); (e) => addTask(board.id, e); }}>
                    <input 
                        type="text" 
                        class="task-input" 
                        placeholder="Add a task..." 
                        bind:value={board.newTaskText}
                    >
                    <button type="submit" class="add-btn">+</button>
                </form>
            </div>
        {/each}

        <div class="add-board-container">
            {#if isAddingBoard}
                <form class="add-board-form" onsubmit={(e) => { e.preventDefault(); addBoard(); }} transition:fade>
                    <input 
                        use:focusInput
                        type="text" 
                        class="board-input" 
                        placeholder="Board title..." 
                        bind:value={newBoardTitle}
                        on:blur={() => { if(!newBoardTitle) isAddingBoard = false; }}
                    >
                    <button type="submit" class="save-board-btn">Add</button>
                </form>
            {:else}
                <button class="new-board-btn" onclick={() => isAddingBoard = true}>
                    + Add New Board
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #0a0a0a;
        color: #e5e5e5;
        font-family: 'Inter', sans-serif;
        overflow: hidden;
    }

    .header {
        display: flex;
        align-items: center;
        padding: 20px 30px;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255,255,255,0.05);
        gap: 20px;
    }

    .page-title {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        letter-spacing: -0.5px;
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

    .boards-scroll-container {
        display: flex;
        flex: 1;
        overflow-x: auto;
        padding: 30px;
        gap: 24px;
        align-items: flex-start;
    }

    .boards-scroll-container::-webkit-scrollbar {
        height: 8px;
    }

    .boards-scroll-container::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.1);
        border-radius: 4px;
    }

    .board {
        min-width: 320px;
        width: 320px;
        background: #141414;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.05);
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 120px);
    }

    .board-header {
        padding: 16px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }

    .board-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
    }

    .icon-btn {
        background: transparent;
        border: none;
        color: #737373;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .icon-btn:hover {
        background: rgba(255,255,255,0.1);
        color: #fff;
    }
    
    .icon-btn.danger:hover {
        color: #ef4444;
        background: rgba(239,68,68,0.1);
    }

    .tasks-list {
        flex: 1;
        overflow-y: auto;
        padding: 16px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .tasks-list::-webkit-scrollbar { width: 4px; }
    .tasks-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

    .task-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        background: rgba(255,255,255,0.03);
        padding: 12px;
        border-radius: 8px;
        border: 1px solid transparent;
        transition: all 0.2s;
    }

    .task-item:hover {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.1);
    }

    .task-item.completed .task-text {
        text-decoration: line-through;
        opacity: 0.5;
    }

    .task-text {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
        word-break: break-word;
    }

    .delete-task {
        opacity: 0;
        font-size: 12px;
    }

    .task-item:hover .delete-task {
        opacity: 1;
    }

    /* Custom Checkbox */
    .checkbox-container {
        display: block;
        position: relative;
        cursor: pointer;
        font-size: 22px;
        width: 20px;
        height: 20px;
        user-select: none;
    }
    
    .checkbox-container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }
    
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: transparent;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 6px;
        transition: all 0.2s;
    }
    
    .checkbox-container:hover input ~ .checkmark {
        border-color: rgba(255,255,255,0.6);
    }
    
    .checkbox-container input:checked ~ .checkmark {
        background-color: #10b981;
        border-color: #10b981;
    }
    
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
        left: 6px;
        top: 2px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }
    
    .checkbox-container input:checked ~ .checkmark:after {
        display: block;
    }

    .add-task-form {
        display: flex;
        padding: 16px 20px;
        border-top: 1px solid rgba(255,255,255,0.05);
        gap: 8px;
    }

    .task-input {
        flex: 1;
        background: rgba(255,255,255,0.05);
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 8px 12px;
        color: #fff;
        font-size: 14px;
        outline: none;
        transition: all 0.2s;
    }

    .task-input:focus {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.2);
    }

    .add-btn {
        background: #fff;
        color: #000;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .add-btn:hover {
        background: #e5e5e5;
    }

    .add-board-container {
        min-width: 320px;
        width: 320px;
    }

    .new-board-btn {
        width: 100%;
        padding: 16px;
        background: rgba(255,255,255,0.03);
        border: 1px dashed rgba(255,255,255,0.2);
        border-radius: 16px;
        color: #a3a3a3;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .new-board-btn:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.4);
        color: #fff;
    }

    .add-board-form {
        background: #141414;
        padding: 16px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        gap: 8px;
    }

    .board-input {
        flex: 1;
        background: rgba(255,255,255,0.05);
        border: 1px solid transparent;
        border-radius: 8px;
        padding: 8px 12px;
        color: #fff;
        font-size: 14px;
        outline: none;
    }

    .save-board-btn {
        background: #10b981;
        color: #fff;
        border: none;
        padding: 0 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
    }
</style>
