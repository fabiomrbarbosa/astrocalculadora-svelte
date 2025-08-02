<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import InputForm from '$lib/components/InputForm.svelte';
	import { chartData } from '$lib/chartData.svelte'; // persistent state
</script>

<div class="grid h-full gap-4 lg:grid-cols-3">
	<InputForm />

	{#if chartData.rawEphemeris}
		<div
			id="results"
			class="bg-base-100 rounded-box flex justify-center p-4 shadow-sm lg:col-span-2 print:shadow-none"
		>
			<BirthChart
				name={chartData.meta.name}
				date={chartData.meta.date}
				time={chartData.meta.time}
				city={chartData.meta.city}
				country={chartData.meta.country}
				usedCoordinates={chartData.rawEphemeris.usedCoordinates}
				usedTimezone={chartData.rawEphemeris.usedTimezone}
				planetPositions={chartData.rawEphemeris.planetPositions}
				ascendant={chartData.rawEphemeris.ascendant}
				houses={chartData.rawEphemeris.houses}
				dayNight={chartData.rawEphemeris.dayNight}
				dayRuler={chartData.rawEphemeris.dayRuler}
				hourRuler={chartData.rawEphemeris.hourRuler}
			/>
		</div>
	{/if}
</div>
