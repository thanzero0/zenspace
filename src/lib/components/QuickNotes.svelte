<script>
	import { PenLine } from '@lucide/svelte';
	import { supabase } from '$lib/supabase.js';
	import { currentUser } from '$lib/stores/auth.js';
	import { get } from 'svelte/store';

	let notesValue = $state('');
	/** @type {ReturnType<typeof setTimeout>|null} */
	let saveTimer = null;

	// Load from Supabase on mount
	$effect(() => {
		const user = get(currentUser);
		if (!user) return;
		supabase
			.from('quick_notes')
			.select('content')
			.eq('user_id', user.id)
			.maybeSingle()
			.then(({ data }) => {
				if (data) notesValue = data.content || '';
			});
	});

	function handleInput(/** @type {any} */ e) {
		notesValue = e.target.value;
		// Debounce save by 800ms
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(() => saveNotes(), 800);
	}

	async function saveNotes() {
		const user = get(currentUser);
		if (!user) return;
		await supabase.from('quick_notes').upsert(
			{ user_id: user.id, content: notesValue, updated_at: new Date().toISOString() },
			{ onConflict: 'user_id' }
		);
	}
</script>

<div class="quick-notes-widget bento-tall">
	<h3><PenLine size={18} /> Quick Scratchpad</h3>
	<textarea
		placeholder="Type quick notes here... Saved automatically."
		value={notesValue}
		oninput={handleInput}
	></textarea>
</div>

<style>
	.quick-notes-widget {
		background: rgba(25, 25, 25, 0.4);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 24px;
		display: flex;
		flex-direction: column;
	}

	.quick-notes-widget h3 {
		font-family: 'Outfit', sans-serif;
		font-size: 18px;
		margin-bottom: 12px;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	textarea {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--text);
		font-family: 'Inter', sans-serif;
		font-size: 14px;
		line-height: 1.6;
		resize: none;
		outline: none;
		width: 100%;
	}

	textarea::placeholder {
		color: var(--border-hover);
	}

	/* Bento size */
	.bento-tall {
		grid-column: span 1;
		grid-row: span 2;
	}
</style>
