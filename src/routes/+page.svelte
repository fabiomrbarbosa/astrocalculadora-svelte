<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import { chartData } from '$lib/chartData.svelte'; // persistent state
	import { loadEphemeris } from '$lib/utils';

	function safePad(value: number, min: number, max: number, fallback = '00') {
		const num = Number(value);
		if (Number.isNaN(num) || num < min || num > max) return fallback;
		return String(num).padStart(2, '0');
	}

	function safeYear(value: number) {
		const num = Number(value);
		return Number.isNaN(num) || num < 0 ? '0000' : String(num).padStart(4, '0');
	}

	let form = $state({
		name: '',
		city: '',
		country: '',
		day: 1,
		month: 1,
		year: 2000,
		hour: 12,
		minute: 0,
		second: 0
	});

	let editing = $state(true);
	let isLoading = $state(false);

	let date = $derived(
		`${safePad(form.day, 1, 31)}/${safePad(form.month, 1, 12)}/${safeYear(form.year)}`
	);

	let ISODate = $derived(
		`${safeYear(form.year)}-${safePad(form.month, 1, 12)}-${safePad(form.day, 1, 31)}`
	);

	let time = $derived(
		`${safePad(form.hour, 0, 23)}:${safePad(form.minute, 0, 59)}:${safePad(form.second, 0, 59)}`
	);

	async function handleSubmit(event?: Event) {
		event?.preventDefault();
		chartData.meta = { ...chartData.meta, ...form };
		isLoading = true;

		try {
			await loadEphemeris(form.name, ISODate, time, form.city, form.country);
		} catch (err) {
			console.error('Error loading full chart:', err);
		} finally {
			isLoading = false;
			editing = false;
		}
	}

	$effect(() => {
		if (editing && chartData.rawEphemeris) {
			form = { ...chartData.meta };
		}
	});
</script>

<div class="grid h-full gap-4 lg:grid-cols-3">
	{#if editing}
		<form
			id="input"
			class="bg-base-100 rounded-box p-4 shadow-sm print:hidden"
			onsubmit={handleSubmit}
		>
			<h2 class="text-xl font-bold">Dados do Mapa</h2>

			<fieldset class="fieldset mt-4 flex space-x-2 lg:col-span-2">
				<legend class="fieldset-legend">Nome</legend>
				<input
					type="text"
					placeholder="Nome"
					bind:value={form.name}
					class="input input-bordered w-full"
				/>
			</fieldset>
			<fieldset class="fieldset mt-4 flex space-x-2">
				<legend class="fieldset-legend">Local</legend>
				<input
					type="text"
					placeholder="Cidade"
					bind:value={form.city}
					class="input input-bordered w-full"
				/>
				<input
					type="text"
					placeholder="País"
					bind:value={form.country}
					class="input input-bordered w-full"
				/>
			</fieldset>

			<fieldset class="fieldset flex space-x-2">
				<legend class="fieldset-legend">Data</legend>
				<input
					type="number"
					min="1"
					max="31"
					placeholder="Dia"
					bind:value={form.day}
					class="input input-bordered w-full"
				/>
				<select class="select" bind:value={form.month}>
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
					bind:value={form.year}
					class="input input-bordered w-full"
				/>
			</fieldset>

			<fieldset class="fieldset flex space-x-2">
				<legend class="fieldset-legend">Hora</legend>
				<input
					type="number"
					min="0"
					max="23"
					placeholder="Horas"
					bind:value={form.hour}
					class="input input-bordered w-full"
				/>
				<input
					type="number"
					min="0"
					max="59"
					placeholder="Minutos"
					bind:value={form.minute}
					class="input input-bordered w-full"
				/>
				<input
					type="number"
					min="0"
					max="59"
					placeholder="Segundos"
					bind:value={form.second}
					class="input input-bordered w-full"
				/>
			</fieldset>

			<button type="submit" class="btn btn-primary mt-4 w-full">
				{isLoading ? 'Aguarde…' : 'Criar Mapa'}
			</button>
		</form>
	{/if}
	{#if chartData.rawEphemeris}
		<div
			id="results"
			class="bg-base-100 rounded-box flex justify-center p-4 shadow-sm lg:col-span-2 print:shadow-none"
		>
			<BirthChart
				name={chartData.meta.name}
				{date}
				{time}
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
