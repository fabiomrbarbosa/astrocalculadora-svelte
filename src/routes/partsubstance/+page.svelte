<script>
	import { calculatePartSubstance } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Substance Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartSubstance} use:usePreventDefault>
		<AstroInput keyName="house2Ruler" data={chartData.houses.house2.ruler} />
		<AstroInput keyName="house2Cusp" data={chartData.houses.house2.cusp} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte da Substância</button>
	</form>

	<!-- Result -->
	{#if chartData.results.partSubstance}
		<div id="partSubstanceResults" class="result">{chartData.results.partSubstance}</div>
	{/if}
</div>
