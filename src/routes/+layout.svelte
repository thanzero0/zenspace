<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { currentUser, authLoading, initAuth } from '$lib/stores/auth.js';

	let { children } = $props();

	onMount(() => {
		const cleanup = initAuth();
		return cleanup;
	});

	// Redirect to login if not authenticated (except on /login and /auth/callback)
	$effect(() => {
		const publicRoutes = ['/login', '/auth/callback'];
		const isPublic = publicRoutes.some(r => $page.url.pathname.startsWith(r));
		if (!$authLoading && !$currentUser && !isPublic) {
			goto('/login');
		}
	});
</script>

{#if $authLoading}
	<div class="auth-loading">
		<div class="loading-spinner"></div>
	</div>
{:else}
	{@render children()}
{/if}

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

	.auth-loading {
		position: fixed;
		inset: 0;
		background: #030303;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 2px solid rgba(255,255,255,0.1);
		border-top-color: rgba(255,255,255,0.6);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
