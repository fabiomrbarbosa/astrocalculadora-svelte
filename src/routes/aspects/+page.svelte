<script lang="ts">
	import { chartData } from '$lib/chartData.svelte';
	import { calculateAspects } from '$lib/calcs';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import AspectGrid from '$lib/components/AspectGrid.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
	$inspect(chartData.results.aspects);
</script>

<!-- Almutem Figuris Form -->
<div class="panel">
	<form class="form" onsubmit={calculateAspects} use:usePreventDefault>
		<AstroInput keyName="moon" bind:data={chartData.planets.moon} />
		<AstroInput keyName="mercury" showRetrograde={true} bind:data={chartData.planets.mercury} />
		<AstroInput keyName="venus" showRetrograde={true} bind:data={chartData.planets.venus} />
		<AstroInput keyName="sun" bind:data={chartData.planets.sun} />
		<AstroInput keyName="mars" showRetrograde={true} bind:data={chartData.planets.mars} />
		<AstroInput keyName="jupiter" showRetrograde={true} bind:data={chartData.planets.jupiter} />
		<AstroInput keyName="saturn" showRetrograde={true} bind:data={chartData.planets.saturn} />
		<AstroInput keyName="ascendant" bind:data={chartData.points.ascendant} />
		<AstroInput keyName="midheaven" bind:data={chartData.points.midheaven} />

		<button class="submit">Calcular Aspectos</button>
	</form>

	{#if chartData.results.aspects.length > 0}
		<div class="grid gap-4 md:grid-cols-5">
			<div
				class="bg-base-100 rounded-box flex justify-center p-4 shadow-sm md:col-span-3 print:shadow-none"
			>
				<AspectGrid aspects={chartData.results.aspects} />
			</div>
			<div
				id="aspects-results"
				class="stats stats-vertical bg-base-100 shadow-xs md:col-span-2 print:shadow-none"
			>
				<div class="planetary-aspects stat lg:flex lg:grow lg:flex-col">
					<h3 class="mb-2 font-bold">Aspectos entre Planetas</h3>
					<ul class="aspect-list">
						{#each chartData.results.aspects.filter((a) => a.planet2 !== 'ASC' && a.planet2 !== 'MC') as aspect}
							<li class={aspect.outOfSign ? 'text-stone-400' : ''}>
								<span>{aspect.icon}</span>
								<span>{aspect.planet1} {aspect.aspect} {aspect.planet2}</span>
								<span>({aspect.orb}{aspect.applying}{aspect.outOfSign ? ' D' : ''})</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="asc-aspects stat lg:flex lg:grow lg:flex-col">
					<h3 class="mb-2 font-bold">Aspectos ao ASC</h3>
					<ul class="aspect-list">
						{#each chartData.results.aspects.filter((a) => a.planet2 === 'ASC') as aspect}
							<li class={aspect.outOfSign ? 'text-gray-500' : ''}>
								<span>{aspect.icon}</span>
								<span>{aspect.planet1} {aspect.aspect} ao {aspect.planet2}</span>
								<span>({aspect.orb})</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="mc-aspects stat lg:flex lg:grow lg:flex-col">
					<h3 class="mb-2 font-bold">Aspectos ao MC</h3>
					<ul class="aspect-list">
						{#each chartData.results.aspects.filter((a) => a.planet2 === 'MC') as aspect}
							<li class={aspect.outOfSign ? 'text-stone-400' : ''}>
								<span>{aspect.icon}</span>
								<span>{aspect.planet1} {aspect.aspect} ao {aspect.planet2}</span>
								<span>({aspect.orb})</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</div>
