<script>
	import { calculatePartFortune } from '$lib/calcs';
	import { chartData } from '$lib/store.svelte';
	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
</script>

<!-- Fortune Form -->
<div class="panel">
	<form class="form" onsubmit={calculatePartFortune} use:usePreventDefault>
		<!-- Day/Night Input -->
		<div>
			<label class="label" for="selectDayNight">O mapa natal é diurno ou noturno?</label>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select">
				<option value="day">Diurno</option>
				<option value="night">Noturno</option>
			</select>
		</div>

		<AstroInput keyName="sun" data={chartData.planets.sun} />
		<AstroInput keyName="moon" data={chartData.planets.moon} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />

		<button class="submit"> Calcular Parte da Fortuna </button>
	</form>
	<!-- Result -->
	<div id="fortuneResult" class="result">{chartData.results.partFortune}</div>
</div>
