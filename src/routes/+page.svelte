<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Header from '$lib/components/Header.svelte';
	import BentoGrid from '$lib/components/BentoGrid.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
</script>

<svelte:head>
	<title>Zenspace — Dashboard</title>
	<meta name="description" content="Zenspace premium utility dashboard for productivity, finance, lifestyle, and fun." />
</svelte:head>

<!-- Ambient Background Effects -->
<div class="ambient-bg"></div>
<div class="grid-bg"></div>

<!-- Sidebar -->
<Sidebar />

<!-- Main Content -->
<main class="main-content">
	<Header />
	<BentoGrid />
</main>

<!-- Command Palette Overlay -->
<CommandPalette />

<style>
	.ambient-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.015) 0%, transparent 50%),
			radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.01) 0%, transparent 50%);
		z-index: 0;
		pointer-events: none;
	}

	.grid-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image:
			linear-gradient(var(--border) 1px, transparent 1px),
			linear-gradient(90deg, var(--border) 1px, transparent 1px);
		background-size: 60px 60px;
		opacity: 0.3;
		z-index: 0;
		pointer-events: none;
		mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
		-webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 80%);
	}

	.main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		z-index: 10;
		position: relative;
	}
</style>
