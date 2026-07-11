<script>
	import { categories } from '$lib/data/utilities.js';
	import { activeCategory } from '$lib/stores/app.js';
	import {
		LayoutGrid,
		Briefcase,
		Wallet,
		Coffee,
		Gamepad2
	} from '@lucide/svelte';

	const iconMap = { LayoutGrid, Briefcase, Wallet, Coffee, Gamepad2 };
</script>

<aside class="sidebar">
	<div class="brand">
		<div class="brand-icon">Z</div>
		<div class="brand-text">ZENSPACE</div>
	</div>

	<nav class="nav-section">
		<div class="nav-label">Library</div>
		{#each categories as cat}
			<button
				class="nav-item"
				class:active={$activeCategory === cat.id}
				onclick={() => activeCategory.set(cat.id)}
			>
				{@const Icon = iconMap[cat.icon]}
				<Icon size={18} />
				{cat.label}
			</button>
		{/each}
	</nav>
</aside>

<style>
	.sidebar {
		width: 260px;
		background: var(--surface);
		border-right: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		padding: 24px 16px;
		z-index: 10;
		flex-shrink: 0;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 0 12px 32px;
	}

	.brand-icon {
		width: 32px;
		height: 32px;
		background: var(--text);
		color: var(--bg);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-family: 'Outfit', sans-serif;
	}

	.brand-text {
		font-family: 'Outfit', sans-serif;
		font-size: 20px;
		font-weight: 700;
		letter-spacing: 1px;
	}

	.nav-section {
		margin-bottom: 32px;
	}

	.nav-label {
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: var(--text-dim);
		padding: 0 12px;
		margin-bottom: 12px;
		font-weight: 600;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 10px 12px;
		width: 100%;
		color: var(--text-dim);
		background: none;
		border: 1px solid transparent;
		border-radius: var(--radius-sm);
		transition: var(--transition);
		font-size: 14px;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
	}

	.nav-item:hover,
	.nav-item.active {
		background: var(--surface-hover);
		color: var(--text);
	}

	.nav-item.active {
		border-color: var(--border);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}
</style>
