<script>
    import { onMount } from 'svelte';
    import { slide, fade } from 'svelte/transition';

    /** @type {any} */

    let transactions = $state([]);
    /** @type {any} */
    let budget = $state(0);
    /** @type {any} */
    let isAddingTx = $state(false);

    /** @type {any} */

    let newTx = $state({ type: 'expense', category: 'Food', amount: '', note: '' });

    const categories = {
        expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'],
        income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other']
    };

    const CATEGORY_COLORS = {
        Food: '#f97316', Transport: '#3b82f6', Shopping: '#ec4899',
        Bills: '#f59e0b', Health: '#10b981', Entertainment: '#8b5cf6',
        Salary: '#22c55e', Freelance: '#06b6d4', Investment: '#a3e635',
        Gift: '#f472b6', Other: '#737373', Income: '#22c55e'
    };

    let totalIncome = $derived(transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
    let totalExpense = $derived(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
    let balance = $derived(totalIncome - totalExpense);

    let categoryTotals = $derived((() => {
        const map = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            map[t.category] = (map[t.category] || 0) + t.amount;
        });
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    })());

    function save() {
        localStorage.setItem('zenspace-budget', JSON.stringify({ transactions, budget }));
    }

    function addTransaction() {
        const amount = parseFloat(newTx.amount);
        if (!amount || amount <= 0) return;
        transactions = [{ ...newTx, id: Date.now(), amount, date: new Date().toISOString() }, ...transactions];
        newTx = { type: 'expense', category: 'Food', amount: '', note: '' };
        isAddingTx = false;
        save();
    }

    function deleteTransaction(id) /* @type {any} */ {
        transactions = transactions.filter(t => t.id !== id);
        save();
    }

    function formatCurrency(n) /* @type {any} */ {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    }

    function formatDate(iso) /* @type {any} */ {
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    onMount(() => {
        const saved = localStorage.getItem('zenspace-budget');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                transactions = data.transactions || [];
                budget = data.budget || 0;
            } catch(e) {}
        }
    });
</script>

<svelte:head><title>Budget Planner — Zenspace</title></svelte:head>

<div class="app-container">
    <div class="header">
        <div class="brand">💰 Budget Planner</div>
        <div class="header-right">
            <a href="/" class="home-btn">⌂ Home</a>
        </div>
    </div>

    <div class="main-layout">
        <!-- Summary Cards -->
        <div class="summary-grid">
            <div class="summary-card income">
                <div class="card-label">Income</div>
                <div class="card-amount">{formatCurrency(totalIncome)}</div>
            </div>
            <div class="summary-card expense">
                <div class="card-label">Expenses</div>
                <div class="card-amount">{formatCurrency(totalExpense)}</div>
            </div>
            <div class="summary-card balance" class:negative={balance < 0}>
                <div class="card-label">Balance</div>
                <div class="card-amount">{formatCurrency(balance)}</div>
            </div>
        </div>

        <div class="content-grid">
            <!-- Transactions -->
            <div class="panel">
                <div class="panel-header">
                    <h3>Transactions</h3>
                    <button class="add-btn" onclick={() => isAddingTx = !isAddingTx}>+ Add</button>
                </div>

                {#if isAddingTx}
                    <form class="add-form" onsubmit={(e) => { e.preventDefault(); addTransaction(); }} transition:slide>
                        <div class="form-row">
                            <label>
                                Type
                                <select bind:value={newTx.type} onchange={() => newTx.category = categories[newTx.type][0]}>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </label>
                            <label>
                                Category
                                <select bind:value={newTx.category}>
                                    {#each categories[newTx.type] as cat}
                                        <option value={cat}>{cat}</option>
                                    {/each}
                                </select>
                            </label>
                        </div>
                        <div class="form-row">
                            <label>
                                Amount
                                <input type="number" bind:value={newTx.amount} placeholder="0" min="0" required>
                            </label>
                            <label>
                                Note
                                <input type="text" bind:value={newTx.note} placeholder="Optional...">
                            </label>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="cancel-btn" onclick={() => isAddingTx = false}>Cancel</button>
                            <button type="submit" class="primary-btn">Add Transaction</button>
                        </div>
                    </form>
                {/if}

                <div class="tx-list">
                    {#if transactions.length === 0}
                        <div class="empty">No transactions yet. Add your first one!</div>
                    {/if}
                    {#each transactions as tx (tx.id)}
                        <div class="tx-item" transition:slide|local>
                            <div class="tx-dot" style="background: {CATEGORY_COLORS[tx.category] || '#737373'}"></div>
                            <div class="tx-info">
                                <span class="tx-category">{tx.category}</span>
                                {#if tx.note}<span class="tx-note">{tx.note}</span>{/if}
                            </div>
                            <span class="tx-date">{formatDate(tx.date)}</span>
                            <span class="tx-amount" class:income={tx.type === 'income'} class:expense={tx.type === 'expense'}>
                                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                            </span>
                            <button class="delete-btn" onclick={() => deleteTransaction(tx.id)}>✕</button>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Category Breakdown -->
            <div class="panel">
                <div class="panel-header">
                    <h3>Expense Breakdown</h3>
                </div>
                {#if categoryTotals.length === 0}
                    <div class="empty">No expense data.</div>
                {:else}
                    <div class="breakdown-list">
                        {#each categoryTotals as [cat, amt]}
                            <div class="breakdown-item">
                                <div class="breakdown-label">
                                    <div class="breakdown-dot" style="background: {CATEGORY_COLORS[cat] || '#737373'}"></div>
                                    <span>{cat}</span>
                                </div>
                                <div class="breakdown-bar-wrap">
                                    <div class="breakdown-bar"
                                        style="width: {Math.min(100, (amt / totalExpense) * 100)}%; background: {CATEGORY_COLORS[cat] || '#737373'}">
                                    </div>
                                </div>
                                <span class="breakdown-amount">{formatCurrency(amt)}</span>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
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
        transition: all 0.2s;
    }
    .home-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

    .header-right { display: flex; gap: 12px; align-items: center; }

    .main-layout { padding: 30px; display: flex; flex-direction: column; gap: 24px; max-width: 1100px; margin: 0 auto; width: 100%; }

    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

    .summary-card {
        background: #111;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        padding: 20px 24px;
    }
    .summary-card.income { border-color: rgba(34,197,94,0.2); }
    .summary-card.expense { border-color: rgba(239,68,68,0.2); }
    .summary-card.balance.negative { border-color: rgba(239,68,68,0.3); }

    .card-label { font-size: 12px; color: #737373; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }

    .card-amount { font-size: 24px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
    .income .card-amount { color: #22c55e; }
    .expense .card-amount { color: #f87171; }

    .content-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; }

    .panel {
        background: #0f0f0f;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 16px;
        overflow: hidden;
    }

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .panel-header h3 { margin: 0; font-size: 16px; font-weight: 600; }

    .add-btn {
        background: #fff;
        color: #000;
        border: none;
        padding: 7px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }
    .add-btn:hover { background: #e5e5e5; }

    .add-form {
        padding: 20px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

    label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 12px;
        color: #737373;
    }

    input, select {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 8px 12px;
        color: #fff;
        font-size: 14px;
        outline: none;
        font-family: inherit;
    }

    input:focus, select:focus { border-color: rgba(255,255,255,0.3); }

    .form-actions { display: flex; gap: 10px; justify-content: flex-end; }

    .primary-btn {
        background: #fff;
        color: #000;
        border: none;
        padding: 8px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }

    .cancel-btn {
        background: rgba(255,255,255,0.07);
        border: 1px solid rgba(255,255,255,0.1);
        color: #e5e5e5;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
    }

    .tx-list {
        max-height: 500px;
        overflow-y: auto;
    }

    .tx-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 24px;
        border-bottom: 1px solid rgba(255,255,255,0.03);
        transition: background 0.2s;
    }
    .tx-item:hover { background: rgba(255,255,255,0.03); }

    .tx-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

    .tx-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .tx-category { font-size: 14px; font-weight: 500; }
    .tx-note { font-size: 12px; color: #737373; }
    .tx-date { font-size: 12px; color: #525252; }
    .tx-amount { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; }
    .tx-amount.income { color: #22c55e; }
    .tx-amount.expense { color: #f87171; }

    .delete-btn {
        background: transparent;
        border: none;
        color: #525252;
        cursor: pointer;
        font-size: 12px;
        padding: 4px;
        opacity: 0;
        transition: all 0.2s;
    }
    .tx-item:hover .delete-btn { opacity: 1; }
    .delete-btn:hover { color: #ef4444; }

    .empty { padding: 40px; text-align: center; color: #525252; font-size: 14px; }

    .breakdown-list { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }

    .breakdown-item { display: flex; align-items: center; gap: 12px; }
    .breakdown-label { display: flex; align-items: center; gap: 8px; width: 100px; font-size: 13px; flex-shrink: 0; }
    .breakdown-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .breakdown-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
    .breakdown-bar { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
    .breakdown-amount { font-size: 12px; font-family: 'JetBrains Mono', monospace; color: #a3a3a3; width: 80px; text-align: right; flex-shrink: 0; }
</style>
