<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let theme: 'light' | 'dark' = 'light';

	onMount(() => {
		if (!browser) return;

		const saved = localStorage.getItem('theme');
		theme =
			saved === 'dark'
				? 'dark'
				: saved === 'light'
					? 'light'
					: window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light';

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

<label class="flex cursor-pointer gap-2 pr-4 pl-4" aria-label="Ligar modo escuro">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<circle cx="12" cy="12" r="5" />
		<path
			d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
		/>
	</svg>

	<input
		type="checkbox"
		class="toggle theme-controller"
		checked={theme === 'dark'}
		on:change={toggleTheme}
	/>

	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	</svg>
</label>
