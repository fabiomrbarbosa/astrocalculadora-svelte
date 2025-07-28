<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let theme: 'light' | 'dark' = 'light';

	onMount(() => {
		if (!browser) return;

		// Use saved theme, or fall back to system preference
		const saved = localStorage.getItem('theme');
		if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			theme = 'dark';
		}

		applyTheme();
	});

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
		applyTheme();
	}

	function applyTheme() {
		if (!browser) return;
		document.documentElement.setAttribute('data-theme', theme);
	}
</script>

<button on:click={toggleTheme} class="btn btn-sm btn-ghost" aria-label="Toggle dark mode">
	{#if theme === 'dark'}
		🌙
	{:else}
		☀️
	{/if}
</button>
