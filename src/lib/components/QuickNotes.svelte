<script>
	import { PenLine } from '@lucide/svelte';

	let notesValue = $state('');

	$effect(() => {
		// Load from localStorage on mount
		if (typeof window !== 'undefined') {
			notesValue = localStorage.getItem('zenspace_quick_notes') || '';
		}
	});

	function handleInput(e) /* @type {any} */ {
		notesValue = e.target.value;
		localStorage.setItem('zenspace_quick_notes', notesValue);
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
