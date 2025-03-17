<script>
	import { calculatePartChildren } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Children Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartChildren} use:usePreventDefault>
		<!-- Day/Night Input -->
		<div>
			<label class="label" for="selectDayNight">O mapa natal é diurno ou noturno?</label>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select">
				<option value="day">Diurno</option>
				<option value="night">Noturno</option>
			</select>
		</div>

		<AstroInput keyName="jupiter" data={chartData.planets.jupiter} />
		<AstroInput keyName="saturn" data={chartData.planets.saturn} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte dos Filhos</button>
	</form>

	<!-- Result -->
	<div id="partChildrenResults" class="result">{chartData.results.partChildren}</div>
</div>
