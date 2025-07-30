<script lang="ts">
	import { syncChartToData } from '$lib/syncChartToData';
	import { chartData } from '$lib/chartData.svelte'; // persistent state
	import SpeculumTable from '$lib/components/SpeculumTable.svelte';

	let ephemerisResult = $state(chartData.rawEphemeris);

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
				body: JSON.stringify({ date: date, time: time, city: meta.city, country: meta.country })
			});
			if (!res.ok) throw new Error(await res.text());

			ephemerisResult = await res.json();
			syncChartToData(ephemerisResult);
		} catch (err) {
			console.error('Error fetching chart:', err);
		}
	}
</script>

<div class="grid h-full gap-4">
	<form class="bg-base-100 rounded-box p-4 shadow-sm" onsubmit={submitChart}>
		<h2 class="text-xl font-bold">Dados do Mapa</h2>

		<div class="mt-4 grid items-stretch gap-4 lg:grid-cols-2">
			<fieldset class="fieldset flex space-x-2 lg:col-span-2">
				<legend class="fieldset-legend">Local</legend>
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
			</fieldset>

			<fieldset class="fieldset flex space-x-2 lg:col-span-1">
				<legend class="fieldset-legend">Data</legend>
				<input
					type="number"
					min="1"
					max="31"
					placeholder="Dia"
					bind:value={chartData.meta.day}
					class="input input-bordered w-full"
				/>
				<select class="select" bind:value={chartData.meta.month}>
					<option value={1}>Janeiro</option>
					<option value={2}>Fevereiro</option>
					<option value={3}>Março</option>
					<option value={4}>Abril</option>
					<option value={5}>Maio</option>
					<option value={6}>Junho</option>
					<option value={7}>Julho</option>
					<option value={8}>Agosto</option>
					<option value={9}>Setembro</option>
					<option value={10}>Outubro</option>
					<option value={11}>Novembro</option>
					<option value={12}>Dezembro</option>
				</select>
				<input
					type="number"
					min="0"
					max="9999"
					placeholder="Ano"
					bind:value={chartData.meta.year}
					class="input input-bordered w-full"
				/>
			</fieldset>

			<fieldset class="fieldset flex space-x-2 lg:col-span-1">
				<legend class="fieldset-legend">Hora</legend>
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
			</fieldset>
		</div>
		<button type="submit" class="btn btn-primary mt-4 w-full">Preencher Speculum</button>
	</form>

	{#if ephemerisResult}
		<SpeculumTable
			planetPositions={ephemerisResult.planetPositions}
			ascendant={ephemerisResult.ascendant}
			houses={ephemerisResult.houses}
		/>
	{/if}
</div>
