<script>
	import { calculatePartFortune } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Part of Fortune Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartFortune} use:usePreventDefault>
		<!-- Day/Night Input -->
		<fieldset class="fieldset">
			<legend class="fieldset-legend">O mapa natal é diurno ou nocturno?</legend>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select w-full">
				<option value="day">Diurno</option>
				<option value="night">Nocturno</option>
			</select>
		</fieldset>

		<AstroInput keyName="sun" bind:data={chartData.planets.sun} />
		<AstroInput keyName="moon" bind:data={chartData.planets.moon} />
		<AstroInput keyName="ascendant" bind:data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte da Fortuna </button>
	</form>
	<!-- Result -->
	{#if chartData.results.partFortune}
		<div id="partFortuneResults" class="result">{chartData.results.partFortune}</div>
	{/if}
</div>
