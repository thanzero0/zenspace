<script>
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(:root) {
		--bg: #030303;
		--surface: #0a0a0a;
		--surface-hover: #141414;
		--border: rgba(255, 255, 255, 0.06);
		--border-hover: rgba(255, 255, 255, 0.15);
		--accent: #ffffff;
		--text: #ededed;
		--text-dim: #888888;
		--glass: rgba(15, 15, 15, 0.6);
		--transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		--radius-sm: 12px;
		--radius-md: 20px;
		--radius-lg: 32px;
	}

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		background-color: var(--bg);
		color: var(--text);
		font-family: 'Inter', sans-serif;
		display: flex;
		height: 100vh;
		overflow: hidden;
		-webkit-font-smoothing: antialiased;
	}
</style>
