<script>
	import { utilities } from '$lib/data/utilities.js';
	import { activeCategory } from '$lib/stores/app.js';
	import UtilityCard from './UtilityCard.svelte';
	import QuickNotes from './QuickNotes.svelte';

	const filteredUtilities = $derived(
		$activeCategory === 'all'
			? utilities
			: utilities.filter((u) => u.category === $activeCategory)
	);

	const showQuickNotes = $derived(
		$activeCategory === 'all' || $activeCategory === 'productivity'
	);
</script>

<div class="dashboard-scroll">
	<div class="bento-grid">
		{#if showQuickNotes}
			<QuickNotes />
		{/if}

		{#each filteredUtilities as util (util.title)}
			<UtilityCard
				title={util.title}
				description={util.description}
				icon={util.icon}
				href={util.href}
				size={util.size}
			/>
		{/each}
	</div>

	<footer>
		<p>&copy; 2026 ZENSPACE Premium Utility Suite. Built with precision.</p>
	</footer>
</div>

<style>
	.dashboard-scroll {
		flex: 1;
		overflow-y: auto;
		padding: 40px;
		scroll-behavior: smooth;
	}

	.dashboard-scroll::-webkit-scrollbar {
		width: 8px;
	}

	.dashboard-scroll::-webkit-scrollbar-thumb {
		background: var(--border-hover);
		border-radius: 4px;
	}

	.bento-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		grid-auto-rows: 200px;
		gap: 24px;
		max-width: 1400px;
		margin: 0 auto;
	}

	footer {
		margin-top: 60px;
		padding: 40px 0;
		border-top: 1px solid var(--border);
		text-align: center;
		color: var(--text-dim);
		font-size: 13px;
	}
</style>
