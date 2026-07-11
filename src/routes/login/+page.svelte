<script>
	import { signInWithGoogle } from '$lib/stores/auth.js';

	let loading = $state(false);
	let error = $state('');

	async function handleGoogleLogin() {
		loading = true;
		error = '';
		try {
			await signInWithGoogle();
		} catch (e) {
			error = 'Failed to sign in. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In — Zenspace</title>
	<meta name="description" content="Sign in to Zenspace with your Google account." />
</svelte:head>

<div class="login-page">
	<!-- Ambient background effects -->
	<div class="ambient-orb orb-1"></div>
	<div class="ambient-orb orb-2"></div>
	<div class="grid-overlay"></div>

	<div class="login-container">
		<!-- Logo -->
		<div class="logo-section">
			<div class="logo-icon">Z</div>
			<div class="logo-text">ZENSPACE</div>
		</div>

		<!-- Card -->
		<div class="login-card">
			<div class="card-header">
				<h1>Welcome back</h1>
				<p>Sign in to access your personal workspace</p>
			</div>

			<div class="features-list">
				<div class="feature">
					<span class="feature-dot"></span>
					<span>Habit tracker, notes & to-dos synced across devices</span>
				</div>
				<div class="feature">
					<span class="feature-dot"></span>
					<span>Your data, fully private and secure</span>
				</div>
				<div class="feature">
					<span class="feature-dot"></span>
					<span>Premium productivity utilities all in one place</span>
				</div>
			</div>

			<div class="divider"><span>Continue with</span></div>

			<button
				class="google-btn"
				onclick={handleGoogleLogin}
				disabled={loading}
				id="btn-google-signin"
			>
				{#if loading}
					<div class="spinner"></div>
					<span>Signing in...</span>
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
					</svg>
					<span>Sign in with Google</span>
				{/if}
			</button>

			{#if error}
				<p class="error-msg">{error}</p>
			{/if}

			<p class="fine-print">
				By signing in, you agree to your data being stored securely in Supabase.
				Each account has its own private data.
			</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		overflow: hidden;
	}

	.login-page {
		min-height: 100vh;
		background: #030303;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
	}

	.ambient-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(120px);
		pointer-events: none;
	}

	.orb-1 {
		width: 600px;
		height: 600px;
		background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
		top: -100px;
		left: -100px;
		animation: drift1 8s ease-in-out infinite alternate;
	}

	.orb-2 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
		bottom: -100px;
		right: -100px;
		animation: drift2 10s ease-in-out infinite alternate;
	}

	@keyframes drift1 {
		from { transform: translate(0, 0); }
		to { transform: translate(40px, 30px); }
	}

	@keyframes drift2 {
		from { transform: translate(0, 0); }
		to { transform: translate(-30px, -40px); }
	}

	.grid-overlay {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
		background-size: 60px 60px;
		mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
		-webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
		pointer-events: none;
	}

	.login-container {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
		width: 100%;
		max-width: 440px;
		padding: 24px;
		animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes fadeUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.logo-section {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.logo-icon {
		width: 40px;
		height: 40px;
		background: #fff;
		color: #000;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Outfit', sans-serif;
		font-weight: 800;
		font-size: 20px;
	}

	.logo-text {
		font-family: 'Outfit', sans-serif;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 2px;
		color: #ededed;
	}

	.login-card {
		width: 100%;
		background: #0a0a0a;
		border: 1px solid rgba(255,255,255,0.08);
		border-radius: 24px;
		padding: 36px;
		display: flex;
		flex-direction: column;
		gap: 24px;
		box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
	}

	.card-header h1 {
		font-family: 'Outfit', sans-serif;
		font-size: 26px;
		font-weight: 600;
		color: #ededed;
		letter-spacing: -0.5px;
		margin-bottom: 6px;
	}

	.card-header p {
		font-size: 14px;
		color: #666;
	}

	.features-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		color: #888;
	}

	.feature-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(255,255,255,0.4);
		flex-shrink: 0;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		color: #444;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: rgba(255,255,255,0.06);
	}

	.google-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
		padding: 14px 24px;
		background: #fff;
		color: #111;
		border: none;
		border-radius: 14px;
		font-size: 15px;
		font-weight: 600;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: 0 4px 20px rgba(255,255,255,0.1);
	}

	.google-btn:hover:not(:disabled) {
		background: #f0f0f0;
		transform: translateY(-1px);
		box-shadow: 0 8px 30px rgba(255,255,255,0.15);
	}

	.google-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.google-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(0,0,0,0.2);
		border-top-color: #000;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.error-msg {
		text-align: center;
		color: #ef4444;
		font-size: 13px;
		padding: 10px;
		background: rgba(239,68,68,0.08);
		border-radius: 8px;
		border: 1px solid rgba(239,68,68,0.2);
	}

	.fine-print {
		font-size: 11px;
		color: #444;
		text-align: center;
		line-height: 1.6;
	}
</style>
