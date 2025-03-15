<script>
	import { calculateFortune, checkQueryParams } from '$lib/utils';
	import { chartData } from '$lib/store.svelte';
	$effect(() => {
		checkQueryParams();
	});
</script>

<!-- Fortune Form -->
<div class="panel">
	<form class="form" onsubmit={calculateFortune}>
		<!-- Day/Night Input -->
		<div>
			<label class="label" for="selectDayNight">O mapa natal é diurno ou noturno?</label>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select">
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
				bind:value={chartData.planets.sun.degrees}
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
				bind:value={chartData.planets.sun.minutes}
				max="59"
				min="0"
				placeholder="Minutos"
				class="input"
				inputmode="numeric"
				required
			/>

			<label for="sunSign">Signo</label>
			<select name="sunSign" bind:value={chartData.planets.sun.sign} class="select">
				{#each Object.entries(chartData.signs) as [signKey, sign]}
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
	<div id="fortuneResult" class="result">{chartData.results.fortune}</div>
</div>
