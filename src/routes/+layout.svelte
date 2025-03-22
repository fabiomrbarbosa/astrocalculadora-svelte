<script lang="ts">
	import { chartData } from './../lib/chartData.svelte';
	import '../app.css';
	let { children } = $props();

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

<div class="grid grid-cols-4 gap-4">
	<div class="col-span-4">
		<div class="navbar bg-base-100 shadow-sm">
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
						<li><a href="/aspects">Aspectos</a></li>
						<li><a href="/almutemfiguris">Almutem Figuris</a></li>
						<li><a href="/almutemsubstance">Almutem da Substância</a></li>
						<li><a href="/partfortune">Parte da Fortuna</a></li>
						<li><a href="/partsubstance">Parte da Substância</a></li>
						<li><a href="/partmarriage">Parte do Casamento</a></li>
						<li><a href="/partchildren">Parte dos Filhos</a></li>
						<li><a href="/partfriends">Parte dos Amigos</a></li>
						<li><a href="/partenemies">Parte dos Inimigos</a></li>
						<li><a href="/partreligion">Parte da Religião</a></li>
					</ul>
				</div>
				<a href="/" class="btn btn-ghost text-xl">Cazimi App</a>
			</div>
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal px-1">
					<li><a href="/aspects">Aspectos</a></li>
					<li><a href="/almutemfiguris">Almutem Figuris</a></li>
					<li><a href="/almutemsubstance">Almutem da Substância</a></li>
					<li><a href="/partfortune">Parte da Fortuna</a></li>
					<li><a href="/partsubstance">Parte da Substância</a></li>
					<li><a href="/partmarriage">Parte do Casamento</a></li>
					<li><a href="/partchildren">Parte dos Filhos</a></li>
					<li><a href="/partfriends">Parte dos Amigos</a></li>
					<li><a href="/partenemies">Parte dos Inimigos</a></li>
					<li><a href="/partreligion">Parte da Religião</a></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="row-start-2">2</div>
	<div class="col-span-3 row-start-2">{@render children()}</div>
</div>
