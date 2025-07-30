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
		<fieldset class="fieldset">
			<legend class="fieldset-legend">O mapa natal é diurno ou nocturno?</legend>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select w-full">
				<option value="day">Diurno</option>
				<option value="night">Nocturno</option>
			</select>
		</fieldset>

		<AstroInput keyName="moon" data={chartData.planets.moon} />
		<AstroInput keyName="mercury" data={chartData.planets.mercury} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte da Religião</button>
	</form>

	<!-- Result -->
	{#if chartData.results.partReligion}
		<div id="partReligionResults" class="result">{chartData.results.partReligion}</div>
	{/if}
</div>
