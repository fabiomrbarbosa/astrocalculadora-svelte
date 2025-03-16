<script>
	import { chartData } from '$lib/store.svelte.ts';
	import PlanetInput from './PlanetInput.svelte';
	import AstroPosition from './AstroPosition.svelte';

	export let keyName; // e.g., "house2Cusp", "house2Ruler"
	export let data; // The object (cusp, ruler)

	const isRuler = typeof data === 'string';
</script>

<fieldset class="fieldset border-base-300 rounded-box w-xs border bg-white p-4">
	<legend class="fieldset-legend">
		{isRuler ? `Regente da ${keyName.replace('Ruler', '')}ª Casa` : data.label}
	</legend>

	{#if isRuler}
		<!-- Ruler Selection -->
		<label class="fieldset-label" for="{keyName}Ruler">Regente</label>
		<select
			id="{keyName}Ruler"
			name="{keyName}Ruler"
			bind:value={chartData.houses[keyName.replace('Ruler', '')].ruler}
			class="select"
		>
			<option value="" disabled selected>Selecione um planeta</option>
			{#each Object.entries(chartData.planets) as [planetKey, planet]}
				<option value={planetKey}>{planet.icon} {planet.label}</option>
			{/each}
		</select>

		<!-- Show selected ruler's inputs -->
		{#if chartData.houses[keyName.replace('Ruler', '')].ruler}
			<PlanetInput
				keyName={chartData.houses[keyName.replace('Ruler', '')].ruler}
				data={chartData.planets[chartData.houses[keyName.replace('Ruler', '')].ruler]}
			/>
		{/if}
	{:else}
		<!-- Use AstroPosition for cusp inputs -->
		<AstroPosition {keyName} {data} />
	{/if}
</fieldset>
