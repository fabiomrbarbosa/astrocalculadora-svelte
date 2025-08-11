<script lang="ts">
	import BirthChart from '$lib/components/BirthChart.svelte';
	import AspectGrid from '$lib/components/AspectGrid.svelte';
	import SpeculumTable from '$lib/components/SpeculumTable.svelte';

	import { chartData } from '$lib/chartData.svelte';
</script>

{#if chartData.rawEphemeris}
	<div class="page">
		<h1>test</h1>
	</div>
	<div class="page">
		<h1>Speculum</h1>
		<SpeculumTable {...chartData.rawEphemeris} />
	</div>
	<div class="page">
		<h1>Aspect Grid</h1>
		<AspectGrid aspects={chartData.results.aspects} />
	</div>

	<div class="page">
		<h1>Birth Chart</h1>
		<BirthChart {...chartData.rawEphemeris} />
	</div>
{/if}

<style>
	@media print {
		@page {
			size: A4 portrait;
			margin: 0;
		}

		body {
			margin: 0 !important;
			padding: 0 !important;
		}

		.page {
			width: 210mm;
			height: 297mm;
			margin: 0;
			padding: 16mm;
			box-sizing: border-box;
			overflow: hidden;
			position: relative;
		}

		.page:not(:first-child) {
			break-before: auto;
		}
	}
</style>
