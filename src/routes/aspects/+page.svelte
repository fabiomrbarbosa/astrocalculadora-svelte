<script lang="ts">
	import { chartData } from '$lib/chartData.svelte';
	import { calculateAspects } from '$lib/calcs';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
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
		<div id="aspectsResults" class="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-xs">
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

			<div class="angle-aspects stat lg:flex lg:grow lg:flex-col">
				<h3 class="mb-2 font-bold">Aspectos ao ASC</h3>
				<ul class="aspect-list">
					{#each chartData.results.aspects.filter((a) => a.planet2 === 'ASC') as aspect}
						<li class={aspect.outOfSign ? 'text-stone-400' : ''}>
							<span>{aspect.icon}</span>
							<span>{aspect.planet1} {aspect.aspect} ao {aspect.planet2}</span>
							<span>({aspect.orb})</span>
						</li>
					{/each}
				</ul>

				<h3 class="mt-4 mb-2 font-bold">Aspectos ao MC</h3>
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
	{/if}
</div>
