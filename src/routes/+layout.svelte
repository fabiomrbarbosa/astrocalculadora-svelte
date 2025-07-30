<script lang="ts">
	import DarkModeToggle from './../lib/components/DarkModeToggle.svelte';
	import { chartData } from './../lib/chartData.svelte';
	import '../app.css';
	import { page } from '$app/state';
	let { children } = $props();

	// Menu items
	const menuItems = [
		{ href: '/', label: 'Mapa Natal' },
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
	$effect(() => {
		const savedChartData = localStorage.getItem('chartData');
		if (savedChartData) {
			Object.assign(chartData, JSON.parse(savedChartData));
		}
	});

	$effect(() => {
		localStorage.setItem('chartData', JSON.stringify(chartData));
	});
</script>

<div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
	<div class="lg:col-span-5">
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
				<a href="/" class="btn btn-ghost text-xl">AstroCalculadora</a>
				<DarkModeToggle />
			</div>
		</div>
	</div>
	<div class="hidden lg:row-start-2 lg:block">
		<div class="bg-base-100 rounded-box shadow-sm">
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
	<div class="lg:col-span-4 lg:row-start-2">{@render children()}</div>
</div>
