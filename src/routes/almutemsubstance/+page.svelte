<script>
	import { calculatePartMarriage } from '$lib/calcs';
	import { chartData } from '$lib/store.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
</script>

<!-- Fortune Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartMarriage}>
		<AstroInput keyName="house2Cusp" data={chartData.houses.house2.cusp} />
		<AstroInput keyName="house2Ruler" data={chartData.houses.house2.ruler} />
		<AstroInput keyName="house2Planets" data={chartData.houses.house2.planets} />
		<AstroInput keyName="partFortune" data={chartData.points.partFortune} />
		<AstroInput keyName="partFortuneDispositor" data={chartData.points.partFortune.dispositor} />
		<AstroInput keyName="partSubstance" data={chartData.points.partSubstance} />
		<AstroInput
			keyName="partSubstanceDispositor"
			data={chartData.points.partSubstance.dispositor}
		/>
		<AstroInput keyName="jupiter" data={chartData.planets.jupiter} />

		<button class="submit"> Calcular Almutem da Substância</button>
	</form>
	<!-- Result -->
	<div id="fortuneResult" class="result">{chartData.results.partMarriage}</div>
</div>
