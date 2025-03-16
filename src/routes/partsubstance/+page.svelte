<script>
	import { calculatePartMarriage } from '$lib/calcs';
	import { chartData } from '$lib/store.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
</script>

<!-- Fortune Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartMarriage}>
		<AstroInput keyName="house2Ruler" data={chartData.houses.house2.ruler} />
		<AstroInput keyName="house2Cusp" data={chartData.houses.house2.cusp} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit"> Calcular Parte do Casamento </button>
	</form>
	<!-- Result -->
	<div id="fortuneResult" class="result">{chartData.results.partMarriage}</div>
</div>
