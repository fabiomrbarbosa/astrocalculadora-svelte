<script>
	import { calculatePartMarriage } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Marriage Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartMarriage} use:usePreventDefault>
		<!-- Day/Night Input -->
		<div>
			<label class="label" for="selectMaleFemale">O mapa natal é masculino ou feminino?</label>
			<select name="selectMaleFemale" bind:value={chartData.maleFemale} class="select">
				<option value="male">Masculino</option>
				<option value="female">Feminino</option>
			</select>
		</div>

		<AstroInput keyName="venus" data={chartData.planets.venus} />
		<AstroInput keyName="saturn" data={chartData.planets.saturn} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte do Casamento</button>
	</form>
	<!-- Result -->
	<div id="partMarriageResults" class="result">{chartData.results.partMarriage}</div>
</div>
