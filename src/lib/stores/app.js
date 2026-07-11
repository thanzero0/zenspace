import { writable } from 'svelte/store';

/** @type {import('svelte/store').Writable<string>} Active category filter */
export const activeCategory = writable('all');

/** @type {import('svelte/store').Writable<boolean>} Command palette open state */
export const paletteOpen = writable(false);
