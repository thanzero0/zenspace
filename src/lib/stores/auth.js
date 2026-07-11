import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase.js';

/** @type {import('svelte/store').Writable<import('@supabase/supabase-js').User | null>} */
export const currentUser = writable(null);

/** @type {import('svelte/store').Writable<boolean>} */
export const authLoading = writable(true);

export async function signInWithGoogle() {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo: `${window.location.origin}/auth/callback`
		}
	});
	if (error) throw error;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
	currentUser.set(null);
}

export function initAuth() {
	// Get initial session
	supabase.auth.getSession().then(({ data: { session } }) => {
		currentUser.set(session?.user ?? null);
		authLoading.set(false);
	});

	// Listen for auth changes
	const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
		currentUser.set(session?.user ?? null);
		authLoading.set(false);
	});

	return () => subscription.unsubscribe();
}
