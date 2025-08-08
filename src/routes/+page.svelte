<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import { chartData, chartInput } from '$lib/chartData.svelte'; // persistent state
	import { loadEphemeris } from '$lib/utils';
	import html2canvas from 'html2canvas-pro';
	import jsPDF from 'jspdf';

	// PDF
	async function fetchFontAsBase64(url: string): Promise<string> {
		const response = await fetch(url);
		const blob = await response.blob();

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = () => reject('Failed to read font blob');
			reader.readAsDataURL(blob);
		});
	}

	async function generatePDF() {
		const wrapper = document.getElementById('results');
		if (!wrapper) return;

		const svg = wrapper.querySelector('svg');
		if (!svg) {
			console.error('SVG not found inside #results');
			return;
		}

		// Clone SVG so we can modify it safely
		const clone = svg.cloneNode(true) as SVGElement;

		// Inline all computed styles into the cloned SVG
		const all = clone.querySelectorAll('*');
		all.forEach((el) => {
			const computed = getComputedStyle(el);
			let inline = '';
			for (let i = 0; i < computed.length; i++) {
				const prop = computed[i];
				const val = computed.getPropertyValue(prop);
				inline += `${prop}:${val};`;
			}
			el.setAttribute('style', inline);
		});

		// Serialize and encode the SVG
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(clone);
		const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;

		// Wait for the font to load
		await document.fonts.load('1em Astronomicon');
		await document.fonts.ready;

		// Load image
		const img = new Image();
		img.src = svgBase64;

		await new Promise((resolve) => (img.onload = resolve));

		const canvas = document.createElement('canvas');
		canvas.width = svg.width.baseVal.value || 1000;
		canvas.height = svg.height.baseVal.value || 1000;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.drawImage(img, 0, 0);

		// Convert to PDF
		const imgData = canvas.toDataURL('image/png');
		const pdf = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		});

		const pageWidth = pdf.internal.pageSize.getWidth();
		const pdfWidth = pageWidth;
		const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

		pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
		pdf.save(`${chartData.meta.name}-mapa.pdf`);
	}
	// END PDF.

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

<button id="generate-pdf" onclick={generatePDF}>Generate PDF</button>
