<script lang="ts">
	import { chartData } from '$lib/chartData.svelte';
	import { calculateAspects } from '$lib/calcs';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Almutem Figuris Form -->
<div class="panel">
	<form class="form" onsubmit={calculateAspects} use:usePreventDefault>
		<AstroInput keyName="moon" data={chartData.planets.moon} />
		<AstroInput keyName="mercury" showRetrograde={true} data={chartData.planets.mercury} />
		<AstroInput keyName="venus" showRetrograde={true} data={chartData.planets.venus} />
		<AstroInput keyName="sun" data={chartData.planets.sun} />
		<AstroInput keyName="mars" showRetrograde={true} data={chartData.planets.mars} />
		<AstroInput keyName="jupiter" showRetrograde={true} data={chartData.planets.jupiter} />
		<AstroInput keyName="saturn" showRetrograde={true} data={chartData.planets.saturn} />

		<button class="submit">Calcular Aspectos</button>
	</form>

	{#if chartData.results.aspects.length > 0}
		<div id="aspectsResults" class="result">
			<ul class="aspect-list">
				{#each chartData.results.aspects as aspect, index}
					<li class={aspect.outOfSign ? 'text-gray-400' : ''}>
						<span>{aspect.icon}</span>
						<span>{aspect.planet1} {aspect.aspect} {aspect.planet2}</span>
						<span>({aspect.orb}{aspect.applying}{aspect.outOfSign ? ' D' : ''})</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
