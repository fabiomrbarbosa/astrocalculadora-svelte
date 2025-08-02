<script lang="ts">
	import DarkModeToggle from './../lib/components/DarkModeToggle.svelte';
	import { chartData, chartInput } from './../lib/chartData.svelte';
	import '../app.css';
	import { page } from '$app/state';
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

	// minimal persistence: load once and debounce saves
	function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
		let timeout: number | null = null;
		return (...args: Parameters<T>) => {
			if (timeout !== null) clearTimeout(timeout);
			timeout = window.setTimeout(() => fn(...args), ms) as unknown as number;
		};
	}

	let _loadedChartData = false;
	let _loadedChartInput = false;

	$effect(() => {
		if (typeof localStorage === 'undefined') return; // guard for SSR
		if (!_loadedChartData) {
			const saved = localStorage.getItem('chartData_v2');
			if (saved) Object.assign(chartData, JSON.parse(saved));
			_loadedChartData = true;
		}
		if (!_loadedChartInput) {
			const savedInput = localStorage.getItem('chartInput_v1');
			if (savedInput) Object.assign(chartInput, JSON.parse(savedInput));
			_loadedChartInput = true;
		}
	});

	const saveChartData = debounce(() => {
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.setItem('chartData_v2', JSON.stringify(chartData));
		} catch (e) {
			console.warn('Failed to persist chartData:', e);
		}
	}, 150);

	const saveChartInput = debounce(() => {
		if (typeof localStorage === 'undefined') return;
		try {
			localStorage.setItem('chartInput_v1', JSON.stringify(chartInput));
		} catch (e) {
			console.warn('Failed to persist chartInput:', e);
		}
	}, 150);

	$effect(() => {
		const saveChartInput = debounce(() => {
			if (typeof localStorage === 'undefined') return;
			try {
				localStorage.setItem('chartInput_v1', JSON.stringify(chartInput));
			} catch (e) {
				console.warn('Failed to persist chartInput:', e);
			}
		}, 150);
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
				<a href="/" class="btn btn-ghost text-xl">AstroCalculadora<sup>β</sup></a>
				<DarkModeToggle />
			</div>
		</div>
	</div>
	<div id="sidebar" class="lg:row-start-2 lg:block print:hidden">
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
	<div id="body" class="lg:col-span-4 lg:row-start-2">{@render children()}</div>
</div>
