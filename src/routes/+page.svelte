<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import { syncEphemerisToChartData } from '$lib/syncChartToData';

	let city = '';
	let country = '';

	let day = '';
	let month = '';
	let year = '';
	let hour = '';
	let minute = '';
	let second = '';

	let chartData: any = null;

	async function submitChart() {
		const date = `${safeYear(year)}-${safePad(month, 1, 12)}-${safePad(day, 1, 31)}`;
		const time = `${safePad(hour, 0, 23)}:${safePad(minute, 0, 59)}:${safePad(second, 0, 59)}`;

		try {
			const res = await fetch('/api/ephemeris', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date, time, city, country })
			});
			if (!res.ok) throw new Error(await res.text());

			chartData = await res.json();
			console.log('Chart result:', chartData);

			syncEphemerisToChartData(chartData);
		} catch (err) {
			console.error('Error fetching chart:', err);
		}
	}

	function safePad(value: string, min: number, max: number, fallback = '00') {
		const num = Number(value);
		if (Number.isNaN(num) || num < min || num > max) return fallback;
		return String(num).padStart(2, '0');
	}

	function safeYear(value: string) {
		const num = Number(value);
		return Number.isNaN(num) || num < 0 ? '0000' : String(num).padStart(4, '0');
	}
</script>

<div class="mt-4 grid md:grid-cols-3">
	<form class="bg-base-100 rounded-box p-4 shadow-sm" on:submit|preventDefault={submitChart}>
		<h2 class="text-xl font-bold">Birth Data</h2>

		<div class="space-y-2">
			<input type="text" placeholder="City" bind:value={city} class="input input-bordered w-full" />
			<input
				type="text"
				placeholder="Country"
				bind:value={country}
				class="input input-bordered w-full"
			/>
		</div>

		<div class="flex space-x-2">
			<input
				type="number"
				min="1"
				max="31"
				placeholder="Day"
				bind:value={day}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="1"
				max="12"
				placeholder="Month"
				bind:value={month}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="0"
				max="9999"
				placeholder="Year"
				bind:value={year}
				class="input input-bordered w-full"
			/>
		</div>

		<div class="flex space-x-2">
			<input
				type="number"
				min="0"
				max="23"
				placeholder="Hour"
				bind:value={hour}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="0"
				max="59"
				placeholder="Minute"
				bind:value={minute}
				class="input input-bordered w-full"
			/>
			<input
				type="number"
				min="0"
				max="59"
				placeholder="Second"
				bind:value={second}
				class="input input-bordered w-full"
			/>
		</div>

		<button type="submit" class="btn btn-primary w-full">Generate Chart</button>
	</form>

	<div class="flex justify-center md:col-span-2">
		{#if chartData}
			<BirthChart
				planetPositions={chartData.planetPositions}
				ascendant={chartData.ascendant}
				usedCoordinates={chartData.usedCoordinates}
				usedTimezone={chartData.usedTimezone}
				houses={chartData.houses}
			/>
		{/if}
	</div>
</div>
