<script>
	import { calculateFortune } from '$lib/utils';
	import { astroData } from '$lib/store.svelte';

	$effect(() => {
		const params = new URLSearchParams(window.location.search);
		const sunSignParam = params.get('sunSign');

		// Only update if the param exists and is a valid sign key
		if (sunSignParam && astroData.signs[sunSignParam]) {
			astroData.planets.sun.sign = sunSignParam;
		}
	});
</script>

<!-- Fortune Form -->
<div class="panel">
	<form class="form" onsubmit={calculateFortune}>
		<!-- Day/Night Input -->
		<div>
			<label class="label" for="selectDayNight">O mapa natal é diurno ou noturno?</label>
			<select name="selectDayNight" bind:value={astroData.dayNight} class="select">
				<option value="day">Diurno</option>
				<option value="night">Noturno</option>
			</select>
		</div>

		<!-- Sun Input -->
		<fieldset>
			<legend>Sol</legend>
			<label for="sunDegrees">Graus</label>
			<input
				name="sunDegrees"
				type="number"
				bind:value={astroData.planets.sun.degrees}
				max="29"
				min="0"
				placeholder="Graus"
				class="input"
				inputmode="numeric"
				required
			/>
			<label for="sunMinutes">Minutos</label>
			<input
				name="sunMinutes"
				type="number"
				bind:value={astroData.planets.sun.minutes}
				max="59"
				min="0"
				placeholder="Minutos"
				class="input"
				inputmode="numeric"
				required
			/>

			<label for="sunSign">Signo</label>
			<select name="sunSign" bind:value={astroData.planets.sun.sign} class="select">
				{#each Object.entries(astroData.signs) as [signKey, sign]}
					<option value={signKey}>
						{sign.icon}
						{sign.label}
					</option>
				{/each}
			</select>
		</fieldset>

		<button class="submit"> Calcular Parte da Fortuna </button>
	</form>
	<!-- Result -->
	<div id="fortuneResult" class="result">{astroData.results.fortune}</div>
</div>
