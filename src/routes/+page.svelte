<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import { chartData, chartInput } from '$lib/chartData.svelte'; // persistent state
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

	let isLoading = $state(false);

	let date = $derived(
		`${safeYear(chartData.meta.year)}-${safePad(chartData.meta.month, 1, 12)}-${safePad(chartData.meta.day, 1, 31)}`
	);

	let time = $derived(
		`${safePad(chartData.meta.hour, 0, 23)}:${safePad(chartData.meta.minute, 0, 59)}:${safePad(chartData.meta.second, 0, 59)}`
	);

	async function handleSubmit(event?: Event) {
		event?.preventDefault();
		chartData.meta = { ...chartData.meta, ...chartInput };
		isLoading = true;

		try {
			await loadEphemeris(chartInput.name, date, time, chartInput.city, chartInput.country);
		} catch (err) {
			console.error('Error loading full chart:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="grid h-full gap-4 lg:grid-cols-3">
	<form
		id="input"
		class="bg-base-100 rounded-box p-4 shadow-sm print:hidden"
		onsubmit={handleSubmit}
	>
		<h2 class="mb-4 text-xl font-bold">Novo Mapa</h2>

		<fieldset class="fieldset flex space-x-2 lg:col-span-2">
			<legend class="fieldset-legend">Nome</legend>
			<input
				type="text"
				placeholder="Nome"
				bind:value={chartInput.name}
				class="input input-bordered w-full"
				required
			/>
		</fieldset>
		<fieldset class="fieldset flex space-x-2">
			<legend class="fieldset-legend">Local</legend>
			<input
				type="text"
				placeholder="Cidade"
				bind:value={chartInput.city}
				class="input input-bordered w-full"
				required
			/>
			<input
				type="text"
				placeholder="País"
				bind:value={chartInput.country}
				class="input input-bordered w-full"
				required
			/>
		</fieldset>

		<fieldset class="fieldset flex space-x-2">
			<legend class="fieldset-legend">Data</legend>
			<input
				type="number"
				min="1"
				max="31"
				placeholder="Dia"
				bind:value={chartInput.day}
				class="input input-bordered"
				required
			/>
			<select class="select grow" bind:value={chartInput.month} required>
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
				bind:value={chartInput.year}
				class="input input-bordered"
				required
			/>
		</fieldset>

		<fieldset class="fieldset flex space-x-2">
			<legend class="fieldset-legend">Hora</legend>
			<input
				type="number"
				min="0"
				max="23"
				placeholder="Horas"
				bind:value={chartInput.hour}
				class="input input-bordered w-full"
				required
			/>
			<input
				type="number"
				min="0"
				max="59"
				placeholder="Minutos"
				bind:value={chartInput.minute}
				class="input input-bordered w-full"
				required
			/>
			<input
				type="number"
				min="0"
				max="59"
				placeholder="Segundos"
				bind:value={chartInput.second}
				class="input input-bordered w-full"
				required
			/>
		</fieldset>

		<button type="submit" class="btn btn-primary mt-4 w-full">
			{#if isLoading}
				Aguarde…
			{:else if chartData.rawEphemeris}
				Editar Mapa
			{:else}
				Criar Mapa
			{/if}
		</button>

		<div role="alert" class="alert alert-soft mt-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="stroke-info h-6 w-6 shrink-0"
			>
				<path
					class="stroke-current"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<span class="text-xs"
				>Esta calculadora usa os padrões atuais de fusos horários e, sempre que possível, considera
				também as práticas antigas. Poderão ocorrer desvios em datas anteriores a 1970.</span
			>
		</div>
	</form>

	{#if chartData.rawEphemeris}
		<div
			id="results"
			class="bg-base-100 rounded-box flex justify-center p-4 shadow-sm lg:col-span-2 print:shadow-none"
		>
			<BirthChart {...chartData.rawEphemeris} />
		</div>
	{/if}
</div>
