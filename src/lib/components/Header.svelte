<script>
	import { paletteOpen } from '$lib/stores/app.js';
	import { Search } from '@lucide/svelte';

	let timeStr = $state('00:00');
	let dateStr = $state('');
	let greeting = $state('Good Evening');

	function updateClock() {
		const now = new Date();
		timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

		const hour = now.getHours();
		if (hour < 12) greeting = 'Good Morning';
		else if (hour < 18) greeting = 'Good Afternoon';
		else greeting = 'Good Evening';
	}

	$effect(() => {
		updateClock();
		const interval = setInterval(updateClock, 1000);
		return () => clearInterval(interval);
	});
</script>

<header class="header">
	<div class="greeting">
		<h1>{greeting}</h1>
		<p>Welcome back to your workspace.</p>
	</div>

	<div class="header-actions">
		<button class="search-trigger" onclick={() => paletteOpen.set(true)}>
			<Search size={16} />
			<span>Search utilities...</span>
			<span class="kbd-shortcut">⌘K</span>
		</button>

		<div class="clock-widget">
			<div class="time">{timeStr}</div>
			<div class="date">{dateStr}</div>
		</div>
	</div>
</header>

<style>
	.header {
		height: 80px;
		border-bottom: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40px;
		background: rgba(10, 10, 10, 0.8);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		z-index: 20;
		flex-shrink: 0;
	}

	.greeting h1 {
		font-family: 'Outfit', sans-serif;
		font-size: 24px;
		font-weight: 600;
		letter-spacing: -0.5px;
	}

	.greeting p {
		font-size: 13px;
		color: var(--text-dim);
		margin-top: 4px;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.search-trigger {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--surface);
		border: 1px solid var(--border);
		padding: 8px 16px;
		border-radius: 20px;
		color: var(--text-dim);
		font-size: 13px;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		transition: var(--transition);
	}

	.search-trigger:hover {
		border-color: var(--border-hover);
		background: var(--surface-hover);
		color: var(--text);
	}

	.kbd-shortcut {
		background: rgba(255, 255, 255, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 11px;
		font-family: monospace;
		color: var(--text);
	}

	.clock-widget {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.time {
		font-family: 'Outfit', sans-serif;
		font-size: 20px;
		font-weight: 600;
	}

	.date {
		font-size: 11px;
		color: var(--text-dim);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
</style>
