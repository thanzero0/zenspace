<script>
    import { fade } from 'svelte/transition';

    const QUOTES = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
        { text: "What we think, we become.", author: "Buddha" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { text: "The mind is everything. What you think you become.", author: "Buddha" },
        { text: "An unexamined life is not worth living.", author: "Socrates" },
        { text: "Spread love everywhere you go.", author: "Mother Teresa" },
        { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
        { text: "Always remember that you are absolutely unique.", author: "Margaret Mead" },
        { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    ];

    /** @type {any} */

    let currentIndex = $state(Math.floor(Math.random() * QUOTES.length));
    /** @type {any} */
    let isVisible = $state(true);
    /** @type {any} */
    let isFavorited = $state(false);

    let currentQuote = $derived(QUOTES[currentIndex]);

    function nextQuote() {
        isVisible = false;
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % QUOTES.length;
            isVisible = true;
            isFavorited = false;
        }, 300);
    }

    function randomQuote() {
        isVisible = false;
        setTimeout(() => {
            let newIdx;
            do { newIdx = Math.floor(Math.random() * QUOTES.length); } while (newIdx === currentIndex);
            currentIndex = newIdx;
            isVisible = true;
            isFavorited = false;
        }, 300);
    }

    function copyQuote() {
        navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
    }
</script>

<svelte:head><title>Quote Generator — Zenspace</title></svelte:head>

<div class="app-container">
    <div class="header">
        <div class="brand">💬 Quote Generator</div>
        <a href="/" class="home-btn">⌂ Home</a>
    </div>

    <div class="main">
        <div class="quote-card">
            {#if isVisible}
                <div class="quote-content" transition:fade={{ duration: 300 }}>
                    <div class="quote-mark">"</div>
                    <blockquote class="quote-text">{currentQuote.text}</blockquote>
                    <cite class="quote-author">— {currentQuote.author}</cite>
                </div>
            {/if}

            <div class="quote-actions">
                <button class="action-btn" onclick={copyQuote} title="Copy">
                    📋 Copy
                </button>
                <button class="action-btn" class:fav={isFavorited} onclick={() => isFavorited = !isFavorited} title="Favorite">
                    {isFavorited ? '❤️' : '🤍'} Favorite
                </button>
                <button class="action-btn secondary" onclick={nextQuote}>Next →</button>
                <button class="action-btn primary" onclick={randomQuote}>🎲 Random</button>
            </div>

            <div class="quote-counter">{currentIndex + 1} / {QUOTES.length}</div>
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

    .main {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }

    .quote-card {
        background: #0f0f0f;
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 24px;
        padding: 50px 60px;
        max-width: 720px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 40px;
        position: relative;
        min-height: 340px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .quote-content {
        display: flex;
        flex-direction: column;
        gap: 24px;
        flex: 1;
    }

    .quote-mark {
        font-size: 80px;
        line-height: 0.8;
        color: rgba(255,255,255,0.08);
        font-family: Georgia, serif;
        margin-bottom: -20px;
    }

    .quote-text {
        font-size: 22px;
        line-height: 1.6;
        font-style: italic;
        color: #e5e5e5;
        margin: 0;
        font-weight: 300;
    }

    .quote-author {
        font-size: 15px;
        color: #737373;
        font-style: normal;
        letter-spacing: 1px;
    }

    .quote-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .action-btn {
        padding: 10px 20px;
        border-radius: 10px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: #a3a3a3;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
    }
    .action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
    .action-btn.fav { border-color: rgba(239,68,68,0.3); color: #f87171; background: rgba(239,68,68,0.07); }
    .action-btn.secondary { background: rgba(255,255,255,0.07); color: #e5e5e5; }
    .action-btn.secondary:hover { background: rgba(255,255,255,0.12); }
    .action-btn.primary { background: #fff; color: #000; border-color: #fff; font-weight: 600; }
    .action-btn.primary:hover { background: #e5e5e5; }

    .quote-counter {
        font-size: 12px;
        color: #525252;
        text-align: right;
        font-family: 'JetBrains Mono', monospace;
    }
</style>
