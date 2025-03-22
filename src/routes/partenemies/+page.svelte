<script>
	import { calculatePartEnemies } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Enemies Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartEnemies} use:usePreventDefault>
		<AstroInput keyName="house12Ruler" data={chartData.houses.house12.ruler} />
		<AstroInput keyName="house12Cusp" data={chartData.houses.house12.cusp} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte dos Inimigos</button>
	</form>

	<!-- Result -->
	{#if chartData.results.partEnemies}
		<div id="partEnemiesResults" class="result">{chartData.results.partEnemies}</div>
	{/if}
</div>
