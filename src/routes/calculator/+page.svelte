<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    /** @type {any} */

    let displayValue = $state('');
    /** @type {any} */
    let currentExpression = $state('');
    /** @type {any} */
    let history = $state([]);
    /** @type {any} */
    let lastResult = $state(0);
    /** @type {any} */
    let isDeg = $state(true);
    /** @type {any} */
    let isInv = $state(false);
    /** @type {any} */
    let isScientific = $state(false);
    /** @type {any} */
    let isHistoryOpen = $state(false);

    onMount(() => {
        const savedHistory = localStorage.getItem('calculator-history');
        if (savedHistory) history = JSON.parse(savedHistory);
        document.body.classList.add('dark-theme'); // default theme
        return () => document.body.classList.remove('dark-theme');
    });

    function handleInput(value) /* @type {any} */ {
        if (value === 'c' || value === 'Escape') {
            currentExpression = '';
            displayValue = '';
            return;
        }

        if (value === '=' || value === 'Enter') {
            calculateResult();
            return;
        }

        if (value === 'Backspace') {
            currentExpression = currentExpression.toString().slice(0, -1);
            displayValue = currentExpression;
            return;
        }

        const scientificMapping = {
            'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(',
            'asin': 'asin(', 'acos': 'acos(', 'atan': 'atan(',
            'log': 'log(', 'ln': 'ln(', 'sqrt': 'sqrt(',
            'pow': '^', 'pi': 'π', 'e': 'e'
        };

        if (scientificMapping[value]) {
            currentExpression += scientificMapping[value];
            displayValue = currentExpression;
            return;
        }

        const operators = ["+", "-", "*", "/", "**", ".", "%"];
        if (!isNaN(value) || value === "(" || value === ")") {
            currentExpression += value;
            displayValue = currentExpression;
        } else if (value === "ans") {
            currentExpression += lastResult;
            displayValue = currentExpression;
        } else if (value === "exp") {
            currentExpression += "*10^(";
            displayValue = currentExpression;
        } else if (value === "!") {
            currentExpression += "!";
            displayValue = currentExpression;
        } else if (operators.includes(value)) {
            const lastChar = currentExpression.toString().slice(-1);
            if (operators.includes(lastChar) && currentExpression.length > 0) {
                currentExpression = currentExpression.toString().slice(0, -1) + value;
            } else if (currentExpression.length > 0 || value === "-") {
                currentExpression += value;
            }
            displayValue = currentExpression;
        }
    }

    function calculateResult() {
        if (!currentExpression) return;
        try {
            let expressionToEval = currentExpression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/sqrt\(/g, 'Math.sqrt(');

            expressionToEval = expressionToEval.replace(/(\d+)!/g, (match, n) => factorial(parseInt(n)));

            const trigRegex = /(asin|acos|atan|sin|cos|tan)\(/g;
            expressionToEval = expressionToEval.replace(trigRegex, (match, func) => {
                if (isDeg && !func.startsWith('a')) return `Math.${func}((Math.PI/180)*`;
                if (isDeg && func.startsWith('a')) return `(180/Math.PI)*Math.${func}(`;
                return `Math.${func}(`;
            });

            // Using new Function instead of eval for slightly better safety
            const result = new Function('return ' + expressionToEval)();

            if (result !== undefined && !isNaN(result)) {
                if (!isFinite(result)) throw new Error("Division by zero");
                
                history = [{ expr: currentExpression, res: result }, ...history].slice(0, 10);
                localStorage.setItem('calculator-history', JSON.stringify(history));

                lastResult = result;
                currentExpression = result.toString();
                displayValue = currentExpression;
            }
        } catch (error) {
            displayValue = "Error";
            setTimeout(() => {
                displayValue = currentExpression;
            }, 1500);
        }
    }

    function factorial(n) /* @type {any} */ {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        /** @type {any} */
        let res = $state(1);
        for (let i = 2; i <= n; i++) res *= i;
        return res;
    }

    function handleKeydown(e) /* @type {any} */ {
        const key = e.key;
        const allowedKeys = [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".",
            "+", "-", "*", "/", "(", ")", "^",
            "Enter", "=", "Backspace", "Escape", "c", "C"
        ];
        if (allowedKeys.includes(key)) {
            if (key === "/" || key === "(" || key === ")") e.preventDefault();
            if (key === "Enter") e.preventDefault();
            handleInput(key === "^" ? "**" : key);
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="app-container">
    <div class="calculator" class:scientific={isScientific}>
        <div class="display-container">
            <div class="ans-display">Ans = {lastResult}</div>
            <input type="text" class="display" readonly value={displayValue || '0'}>
        </div>
        
        <div class="controls-row">
            <button class="toggle-btn" onclick={() => isScientific = !isScientific}>
                {isScientific ? 'Basic' : 'Scientific'}
            </button>
            <button class="toggle-btn" onclick={() => isHistoryOpen = !isHistoryOpen}>
                History
            </button>
            <a href="/" class="toggle-btn home-btn">Home</a>
        </div>

        <div class="buttons">
            {#if isScientific}
                <button class="deg-rad" onclick={() => isDeg = !isDeg}>{isDeg ? 'Deg' : 'Rad'}</button>
                <button onclick={() => handleInput('!')}>x!</button>
            {/if}
            <button onclick={() => handleInput('(')}>(</button>
            <button onclick={() => handleInput(')')}>)</button>
            <button onclick={() => handleInput('%')}>%</button>
            <button class="clear-btn" onclick={() => handleInput('c')}>AC</button>
            {#if isScientific}
                <button class="inv-btn" class:active={isInv} onclick={() => isInv = !isInv}>Inv</button>
                <button onclick={() => handleInput(isInv ? 'asin' : 'sin')}>{isInv ? 'asin' : 'sin'}</button>
                <button onclick={() => handleInput('ln')}>ln</button>
            {/if}
            
            <button onclick={() => handleInput('7')}>7</button>
            <button onclick={() => handleInput('8')}>8</button>
            <button onclick={() => handleInput('9')}>9</button>
            <button onclick={() => handleInput('/')}>÷</button>
            
            {#if isScientific}
                <button onclick={() => handleInput('pi')}>π</button>
                <button onclick={() => handleInput(isInv ? 'acos' : 'cos')}>{isInv ? 'acos' : 'cos'}</button>
                <button onclick={() => handleInput('log')}>log</button>
            {/if}

            <button onclick={() => handleInput('4')}>4</button>
            <button onclick={() => handleInput('5')}>5</button>
            <button onclick={() => handleInput('6')}>6</button>
            <button onclick={() => handleInput('*')}>×</button>
            
            {#if isScientific}
                <button onclick={() => handleInput('e')}>e</button>
                <button onclick={() => handleInput(isInv ? 'atan' : 'tan')}>{isInv ? 'atan' : 'tan'}</button>
                <button onclick={() => handleInput('sqrt')}>√</button>
            {/if}

            <button onclick={() => handleInput('1')}>1</button>
            <button onclick={() => handleInput('2')}>2</button>
            <button onclick={() => handleInput('3')}>3</button>
            <button onclick={() => handleInput('-')}>-</button>
            
            {#if isScientific}
                <button onclick={() => handleInput('ans')}>Ans</button>
                <button onclick={() => handleInput('exp')}>EXP</button>
                <button onclick={() => handleInput('pow')}>x<sup>y</sup></button>
            {/if}

            <button onclick={() => handleInput('0')}>0</button>
            <button onclick={() => handleInput('.')}>.</button>
            <button class="equal-btn" onclick={() => handleInput('=')}>=</button>
            <button onclick={() => handleInput('+')}>+</button>
        </div>
    </div>

    {#if isHistoryOpen}
        <div class="history-panel" transition:fade>
            <div class="history-header">
                <h3>History</h3>
                <button onclick={() => { history = []; localStorage.removeItem('calculator-history'); }}>Clear</button>
                <button onclick={() => isHistoryOpen = false}>Close</button>
            </div>
            <div class="history-list">
                {#each history as item}
                    <button class="history-item" onclick={() => { currentExpression = item.res.toString(); displayValue = currentExpression; isHistoryOpen = false; }}>
                        <div class="history-expr">{item.expr}</div>
                        <div class="history-res">= {item.res}</div>
                    </button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        --bg-color: #000000;
        --calc-bg: #111111;
        --display-bg: #000000;
        --display-text: #ffffff;
        --btn-bg: #222222;
        --btn-hover: #333333;
        --btn-text: #ffffff;
        --clear-bg: #1a1a1a;
        --clear-hover: #333333;
        --btn-clear-text: #ffffff;
        --equal-bg: #ffffff;
        --equal-hover: #cccccc;
        --equal-text: #000000;
    }

    .app-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background: var(--bg-color);
        font-family: 'JetBrains Mono', monospace;
    }

    .calculator {
        width: 320px;
        padding: 24px;
        border-radius: 28px;
        background-color: var(--calc-bg);
        box-shadow: 0 20px 40px rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: width 0.3s ease;
    }

    .calculator.scientific {
        width: 650px;
    }

    .display-container {
        width: 100%;
        margin-bottom: 16px;
        padding: 12px 20px;
        border-radius: 16px;
        background: var(--display-bg);
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    .ans-display {
        font-size: 14px;
        opacity: 0.6;
        color: var(--display-text);
        height: 20px;
    }

    .display {
        width: 100%;
        height: 48px;
        font-size: 32px;
        text-align: right;
        border: none;
        background: transparent;
        color: var(--display-text);
        outline: none;
        padding: 0;
    }

    .controls-row {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
    }

    .toggle-btn {
        flex: 1;
        height: 36px;
        border: none;
        border-radius: 8px;
        background: var(--btn-bg);
        color: var(--btn-text);
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .toggle-btn:hover { background: var(--btn-hover); }

    .home-btn {
        background: var(--clear-bg);
    }

    .buttons {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 12px;
    }

    .calculator.scientific .buttons {
        grid-template-columns: repeat(7, 1fr);
    }

    button {
        height: 50px;
        border: none;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 500;
        cursor: pointer;
        background: var(--btn-bg);
        color: var(--btn-text);
        transition: all 0.2s ease;
    }

    button:hover {
        background: var(--btn-hover);
    }

    .calculator.scientific button {
        height: 44px;
        font-size: 15px;
    }

    .clear-btn {
        background: var(--clear-bg);
        color: var(--btn-clear-text);
    }
    
    .clear-btn:hover {
        background: var(--clear-hover);
    }

    .equal-btn {
        background: var(--equal-bg);
        color: var(--equal-text);
    }

    .equal-btn:hover {
        background: var(--equal-hover);
    }

    .inv-btn.active {
        background: var(--equal-bg);
        color: var(--equal-text);
    }

    .history-panel {
        position: fixed;
        right: 20px;
        top: 20px;
        width: 300px;
        height: calc(100vh - 40px);
        background: var(--calc-bg);
        border-radius: 20px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        color: var(--btn-text);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .history-header h3 { margin: 0; }
    
    .history-header button {
        height: 30px;
        padding: 0 10px;
        font-size: 12px;
    }

    .history-list {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .history-item {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px;
        border-radius: 10px;
        text-align: left;
        height: auto;
    }

    .history-expr {
        font-size: 12px;
        opacity: 0.6;
        margin-bottom: 4px;
    }

    .history-res {
        font-size: 16px;
        font-weight: bold;
    }
</style>
