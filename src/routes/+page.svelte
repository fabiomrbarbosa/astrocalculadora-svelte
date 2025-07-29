<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import { syncChartToData } from '$lib/syncChartToData';
	import { chartData } from '$lib/chartData.svelte'; // persistent state

	let ephemerisResult: any = $state();

	function safePad(value: string, min: number, max: number, fallback = '00') {
		const num = Number(value);
		if (Number.isNaN(num) || num < min || num > max) return fallback;
		return String(num).padStart(2, '0');
	}

	function safeYear(value: string) {
		const num = Number(value);
		return Number.isNaN(num) || num < 0 ? '0000' : String(num).padStart(4, '0');
	}

	async function submitChart() {
		const meta = chartData.meta;
		const date = `${safeYear(meta.year)}-${safePad(meta.month, 1, 12)}-${safePad(meta.day, 1, 31)}`;
		const time = `${safePad(meta.hour, 0, 23)}:${safePad(meta.minute, 0, 59)}:${safePad(meta.second, 0, 59)}`;

		try {
			const res = await fetch('/api/ephemeris', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date, time, city: meta.city, country: meta.country })
			});
			if (!res.ok) throw new Error(await res.text());

			ephemerisResult = await res.json();
			console.log('chartData: ', ephemerisResult);

			syncChartToData(ephemerisResult);
		} catch (err) {
			console.error('Error fetching chart:', err);
		}
	}
</script>

<div class="grid h-full gap-4 md:grid-cols-3">
	<form class="bg-base-100 rounded-box p-4 shadow-sm" onsubmit={submitChart}>
		<h2 class="text-xl font-bold">Dados do Mapa</h2>

		<div class="space-y-2">
			<input
				type="text"
				placeholder="Cidade"
				bind:value={chartData.meta.city}
				class="input input-bordered w-full"
			/>
			<input
				type="text"
				placeholder="País"
				bind:value={chartData.meta.country}
				class="input input-bordered w-full"
			/>
		</div>

		<div class="mt-4 flex space-x-2">
			<input
				type="number"
				min="1"
				max="31"
				placeholder="Dia"
				bind:value={chartData.meta.day}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="1"
				max="12"
				placeholder="Mês"
				bind:value={chartData.meta.month}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="0"
				max="9999"
				placeholder="Ano"
				bind:value={chartData.meta.year}
				class="input input-bordered w-full"
			/>
		</div>

		<div class="mt-4 flex space-x-2">
			<input
				type="number"
				min="0"
				max="23"
				placeholder="Horas"
				bind:value={chartData.meta.hour}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="0"
				max="59"
				placeholder="Minutos"
				bind:value={chartData.meta.minute}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="0"
				max="59"
				placeholder="Segundos"
				bind:value={chartData.meta.second}
				class="input input-bordered w-full"
			/>
		</div>

		<button type="submit" class="btn btn-primary mt-4 w-full">Generate Chart</button>
	</form>

	<div class="bg-base-100 rounded-box flex justify-center p-4 shadow-sm md:col-span-2">
		{#if ephemerisResult}
			<BirthChart
				planetPositions={ephemerisResult.planetPositions}
				ascendant={ephemerisResult.ascendant}
				usedCoordinates={ephemerisResult.usedCoordinates}
				usedTimezone={ephemerisResult.usedTimezone}
				houses={ephemerisResult.houses}
			/>
		{:else if chartData.renderedChart}
			<!-- Render the cached SVG -->
			{@html chartData.renderedChart}
		{/if}
	</div>
</div>
