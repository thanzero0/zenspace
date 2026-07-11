<script>
	import { Icon } from '@lucide/svelte';
	import * as icons from '@lucide/svelte';

	/** @type {string} */
	let { title, description, icon, href, size = 'default' } = $props();

	/** @type {HTMLElement|undefined} */
	let glowEl;

	/**
	 * Get the iconNode array for the dynamic Icon component.
	 * @param {string} name - PascalCase icon name
	 */
	function getIconNode(name) {
		const iconData = icons[name];
		// Each icon export is [name, iconNode] or a Svelte component.
		// In @lucide/svelte, each named export is a Svelte component.
		// We'll use svelte:component instead.
		return iconData;
	}

	$effect(() => {
		// Ensure iconComponent resolves
	});

	/** @param {MouseEvent} e */
	function handleMouseMove(e) {
		if (!glowEl) return;
		const rect = /** @type {HTMLElement} */ (e.currentTarget).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		glowEl.style.left = `${x}px`;
		glowEl.style.top = `${y}px`;
	}

	const sizeClass = {
		default: '',
		wide: 'bento-wide',
		tall: 'bento-tall',
		large: 'bento-large'
	};

	$effect(() => {
		// resolve icon component
	});

	const IconComponent = $derived(icons[icon]);
</script>

<a
	{href}
	class="utility-card {sizeClass[size] || ''}"
	onmousemove={handleMouseMove}
>
	<div class="card-glow" bind:this={glowEl}></div>
	<div class="card-icon-wrapper">
		{#if IconComponent}
			<svelte:component this={IconComponent} size={20} />
		{/if}
	</div>
	<h3>{title}</h3>
	<p>{description}</p>
</a>

<style>
	.utility-card {
		background: rgba(15, 15, 15, 0.4);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 32px;
		text-decoration: none;
		color: inherit;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		transition: border-color 0.3s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	.card-glow {
		position: absolute;
		width: 300px;
		height: 300px;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 60%);
		border-radius: 50%;
		pointer-events: none;
		transform: translate(-50%, -50%);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 0;
	}

	.utility-card:hover {
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-4px) scale(1.01);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
	}

	.utility-card:hover .card-glow {
		opacity: 1;
	}

	.utility-card :global(*) {
		position: relative;
		z-index: 1;
	}

	.card-glow {
		z-index: 0 !important;
	}

	.card-icon-wrapper {
		position: absolute;
		top: 32px;
		left: 32px;
		width: 48px;
		height: 48px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid var(--border);
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text);
		transition: var(--transition);
	}

	.utility-card:hover .card-icon-wrapper {
		background: var(--text);
		color: var(--bg);
		transform: scale(1.05);
	}

	.utility-card h3 {
		font-family: 'Outfit', sans-serif;
		font-size: 22px;
		font-weight: 600;
		margin-bottom: 8px;
		letter-spacing: -0.5px;
	}

	.utility-card p {
		color: var(--text-dim);
		font-size: 14px;
		line-height: 1.5;
	}

	/* Bento sizes */
	.bento-large {
		grid-column: span 2;
		grid-row: span 2;
	}

	.bento-wide {
		grid-column: span 2;
		grid-row: span 1;
	}

	.bento-tall {
		grid-column: span 1;
		grid-row: span 2;
	}

	@media (max-width: 1100px) {
		.bento-large,
		.bento-wide {
			grid-column: span 1;
		}
	}
</style>
