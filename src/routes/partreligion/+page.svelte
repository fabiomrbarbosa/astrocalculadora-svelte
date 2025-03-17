<script>
	import { calculatePartReligion } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Religion Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartReligion} use:usePreventDefault>
		<!-- Day/Night Input -->
		<div>
			<label class="label" for="selectDayNight">O mapa natal é diurno ou noturno?</label>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select">
				<option value="day">Diurno</option>
				<option value="night">Noturno</option>
			</select>
		</div>

		<AstroInput keyName="moon" data={chartData.planets.moon} />
		<AstroInput keyName="mercury" data={chartData.planets.mercury} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte da Religião</button>
	</form>

	<!-- Result -->
	<div id="partReligionResults" class="result">{chartData.results.partReligion}</div>
</div>
