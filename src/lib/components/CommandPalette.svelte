<script>
	import { utilities } from '$lib/data/utilities.js';
	import { paletteOpen } from '$lib/stores/app.js';
	import { Search } from '@lucide/svelte';
	import * as icons from '@lucide/svelte';

	let query = $state('');
	let selectedIndex = $state(0);

	/** @type {HTMLInputElement|undefined} */
	let inputEl;

	const filtered = $derived(
		query.trim() === ''
			? utilities
			: utilities.filter(
					(item) =>
						item.title.toLowerCase().includes(query.toLowerCase()) ||
						item.description.toLowerCase().includes(query.toLowerCase())
				)
	);

	// Reset selection when results change
	$effect(() => {
		filtered; // track dependency
		selectedIndex = 0;
	});

	// Focus input when palette opens
	$effect(() => {
		if ($paletteOpen) {
			query = '';
			selectedIndex = 0;
			// Small delay for DOM to render
			setTimeout(() => inputEl?.focus(), 50);
		}
	});

	// Global keyboard shortcut
	$effect(() => {
		if (typeof window === 'undefined') return;

		/** @param {KeyboardEvent} e */
		function handleKeydown(e) /* @type {any} */ {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault();
				paletteOpen.update((v) => !v);
			}
			if (e.key === 'Escape' && $paletteOpen) {
				paletteOpen.set(false);
			}
		}

		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	/** @param {MouseEvent} e */
	function handleBackdropClick(e) /* @type {any} */ {
		if (e.target === e.currentTarget) {
			paletteOpen.set(false);
		}
	}
</script>

{#if $paletteOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="cmd-palette-backdrop" onclick={handleBackdropClick}>
		<div class="cmd-palette">
			<div class="cmd-search-header">
				<Search size={20} />
				<input
					type="text"
					bind:this={inputEl}
					bind:value={query}
					placeholder="Search utilities or commands..."
					autocomplete="off"
				/>
				<span class="kbd-shortcut">ESC</span>
			</div>
			<div class="cmd-results">
				{#if filtered.length === 0}
					<div class="empty-state">No utilities found for "{query}"</div>
				{:else}
					{#each filtered as item, i}
						{@const IconComp = icons[item.icon]}
						<a
							href={item.href}
							class="cmd-item"
							class:selected={i === selectedIndex}
							onmouseenter={() => (selectedIndex = i)}
						>
							<div class="cmd-icon">
								{#if IconComp}
									<IconComp size={16} />
								{/if}
							</div>
							<div class="cmd-item-info">
								<h4>{item.title}</h4>
								<p>{item.description}</p>
							</div>
						</a>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.cmd-palette-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		z-index: 100;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding-top: 12vh;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.cmd-palette {
		background: var(--surface);
		border: 1px solid var(--border-hover);
		border-radius: var(--radius-md);
		width: 100%;
		max-width: 640px;
		box-shadow: 0 40px 80px rgba(0, 0, 0, 0.8);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.cmd-search-header {
		display: flex;
		align-items: center;
		padding: 20px 24px;
		border-bottom: 1px solid var(--border);
		gap: 16px;
		color: var(--text-dim);
	}

	input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--text);
		font-size: 18px;
		font-family: 'Inter', sans-serif;
		outline: none;
	}

	input::placeholder {
		color: var(--text-dim);
	}

	.kbd-shortcut {
		background: rgba(255, 255, 255, 0.1);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 11px;
		font-family: monospace;
		color: var(--text);
	}

	.cmd-results {
		max-height: 400px;
		overflow-y: auto;
		padding: 12px;
	}

	.cmd-results::-webkit-scrollbar {
		width: 6px;
	}

	.cmd-results::-webkit-scrollbar-thumb {
		background: var(--border-hover);
		border-radius: 3px;
	}

	.cmd-item {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 16px;
		border-radius: var(--radius-sm);
		color: var(--text-dim);
		text-decoration: none;
		transition: background 0.1s;
	}

	.cmd-item:hover,
	.cmd-item.selected {
		background: var(--surface-hover);
		color: var(--text);
	}

	.cmd-icon {
		width: 32px;
		height: 32px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.cmd-item.selected .cmd-icon {
		background: var(--text);
		color: var(--bg);
	}

	.cmd-item-info h4 {
		font-size: 15px;
		font-weight: 500;
		color: var(--text);
	}

	.cmd-item-info p {
		font-size: 12px;
		margin-top: 2px;
	}

	.empty-state {
		padding: 40px;
		text-align: center;
		color: var(--text-dim);
		font-size: 14px;
	}
</style>
