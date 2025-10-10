<script lang="ts">
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';
	import { chartData, chartInput } from '$lib/chartData.svelte';
	import '../app.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let { children } = $props();

	// Menu items
	const menuItems = [
		{ href: '/', label: 'Mapa Natal' },
		{ href: '/speculum', label: 'Speculum' },
		{ href: '/aspects', label: 'Aspectos' },
		{ href: '/almutemfiguris', label: 'Almutem Figuris' },
		{ href: '/almutemsubstance', label: 'Almutem da Substância' },
		{ href: '/partfortune', label: 'Parte da Fortuna' },
		{ href: '/partsubstance', label: 'Parte da Substância' },
		{ href: '/partmarriage', label: 'Parte do Casamento' },
		{ href: '/partchildren', label: 'Parte dos Filhos' },
		{ href: '/partfriends', label: 'Parte dos Amigos' },
		{ href: '/partenemies', label: 'Parte dos Inimigos' },
		{ href: '/partreligion', label: 'Parte da Religião' }
	];

	// Implement data persistence via localStorage
	//–– Debounce utility ––
	function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: Parameters<T>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), ms);
		};
	}

	// We are currently on version 3 of chartData, version 2 of ChartInput
	//–– Load once, on client ––
	onMount(() => {
		const saved = localStorage.getItem('chartData_v3');
		if (saved) Object.assign(chartData, JSON.parse(saved));

		const savedInput = localStorage.getItem('chartInput_v2');
		if (savedInput) Object.assign(chartInput, JSON.parse(savedInput));
	});

	//–– Persist whenever chartData/meta changes ––
	$effect(() => {
		if (!browser) return;
		// reading `chartData` here makes this effect re-run on any change
		localStorage.setItem('chartData_v3', JSON.stringify(chartData));
	});

	//–– Persist whenever the input object changes ––
	$effect(() => {
		if (!browser) return;
		// reading `chartInput` here makes this effect re-run on any change
		localStorage.setItem('chartInput_v2', JSON.stringify(chartInput));
	});
</script>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
	<div id="navbar" class="lg:col-span-5 print:hidden">
		<div class="navbar bg-base-100 rounded-box shadow-sm">
			<div class="navbar-start">
				<div class="dropdown">
					<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h8m-8 6h16"
							/>
						</svg>
					</div>
					<ul
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						{#each menuItems as { href, label }}
							<li>
								<a
									{href}
									class:menu-active={page.url.pathname === href}
									aria-current={page.url.pathname === href ? 'page' : undefined}
								>
									{label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
				<a href="/" class=" pr-4 pl-4 text-xl font-bold">AstroCalculadora<sup>β</sup></a>
			</div>
			<div class="navbar-end">
				<DarkModeToggle />
			</div>
		</div>
	</div>
	<a href="#main" class="skip-to-content-link"> Saltar para o conteúdo principal </a>
	<div id="sidebar" class="hidden lg:row-start-2 lg:block print:hidden">
		<div class="bg-base-100 rounded-box sticky top-4 shadow-sm">
			<ul class="menu sticky top-0 w-full">
				{#each menuItems as { href, label }}
					<li>
						<a
							{href}
							class:menu-active={page.url.pathname === href}
							aria-current={page.url.pathname === href ? 'page' : undefined}
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
	<div id="main" class="lg:col-span-4 lg:row-start-2">{@render children()}</div>
</div>
