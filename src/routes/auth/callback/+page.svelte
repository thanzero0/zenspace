<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase.js';

	onMount(async () => {
		const { data, error } = await supabase.auth.exchangeCodeForSession(
			window.location.href
		);
		if (error) {
			console.error('Auth callback error:', error);
			goto('/login');
		} else {
			goto('/');
		}
	});
</script>

<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#030303;color:#888;">
	<p>Authenticating...</p>
</div>
