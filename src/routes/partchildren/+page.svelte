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
		<fieldset class="fieldset">
			<legend class="fieldset-legend">O mapa natal é diurno ou nocturno?</legend>
			<select name="selectDayNight" bind:value={chartData.dayNight} class="select w-full">
				<option value="day">Diurno</option>
				<option value="night">Nocturno</option>
			</select>
		</fieldset>

		<AstroInput keyName="jupiter" bind:data={chartData.planets.jupiter} />
		<AstroInput keyName="saturn" bind:data={chartData.planets.saturn} />
		<AstroInput keyName="ascendant" bind:data={chartData.points.ascendant} />

		<button class="submit">Calcular Parte dos Filhos</button>
	</form>

	<!-- Result -->
	{#if chartData.results.partChildren}
		<div id="partChildrenResults" class="result">{chartData.results.partChildren}</div>
	{/if}
</div>
