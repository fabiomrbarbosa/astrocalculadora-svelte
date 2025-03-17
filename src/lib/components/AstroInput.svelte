<script lang="ts">
	import {
		chartData,
		getPartFortuneDispositor,
		getPartSubstanceDispositor
	} from '$lib/chartData.svelte';
	import AstroPosition from './AstroPosition.svelte';
	import PlanetInput from './PlanetInput.svelte';
	import RetrogradeInput from './RetrogradeInput.svelte';

	const { keyName, showRetrograde = false, data } = $props();

	// Check what kind of data we're dealing with based on the `keyName`
	const isCusp = keyName.includes('Cusp'); // House cusps
	const isRuler = keyName.includes('Ruler'); // House ruler
	const isPlanetArray = keyName.includes('Planets'); // List of planets in house
	const isDispositor = keyName.includes('Dispositor'); // Precomputed ruler (read-only)
	const isPlanet = keyName in chartData.planets; // A single planet
	const isPoint = keyName in chartData.points; // A single calculated point

	let selectedPlanet = $state('');
</script>

<fieldset class="fieldset border-base-300 rounded-box bg-base-100 w-xs border p-4">
	<legend class="fieldset-legend">
		{#if isCusp}Cúspide da {keyName.replace('Cusp', '').replace('house', '')}ª Casa
		{:else if isRuler}Regente da {keyName.replace('Ruler', '').replace('house', '')}ª Casa
		{:else if isPlanetArray}Planetas na {keyName.replace('Planets', '').replace('house', '')}ª Casa
		{:else if isDispositor}Dispositor da {chartData.points[keyName.replace('Dispositor', '')].label}
		{:else if isPoint}
			{chartData.points[keyName].label}
		{:else if isPlanet}
			{chartData.planets[keyName].label}
		{/if}
	</legend>

	{#if isRuler}
		<!-- House Ruler Dropdown -->
		<label class="fieldset-label" for={keyName}>Regente</label>
		<select
			id={keyName}
			name={keyName}
			bind:value={chartData.houses[keyName.replace('Ruler', '')].ruler}
			class="select"
		>
			<option value="" disabled selected>Selecione um planeta</option>
			{#each Object.entries(chartData.planets) as [planetKey, planet]}
				<option value={planetKey}>{planet.icon} {planet.label}</option>
			{/each}
		</select>

		<!-- Render Ruler Inputs if a Ruler is Selected -->
		{#if chartData.houses[keyName.replace('Ruler', '')]?.ruler}
			<PlanetInput
				keyName={chartData.houses[keyName.replace('Ruler', '')].ruler}
				data={chartData.planets[chartData.houses[keyName.replace('Ruler', '')]?.ruler]}
			/>
		{/if}
	{:else if isPlanetArray}
		<!-- List of Planets in House -->
		{#each data as planetKey, index}
			<div class="flex items-center gap-2">
				<PlanetInput keyName={planetKey} data={chartData.planets[planetKey]} />
				<button type="button" class="submit submit--danger" onclick={() => data.splice(index, 1)}>
					✕
				</button>
			</div>
		{/each}

		<!-- Add Planet Dropdown -->
		<div class="flex gap-2">
			<select bind:value={selectedPlanet} class="select">
				<option value="" disabled selected>Adicionar um planeta</option>
				{#each Object.entries(chartData.planets) as [planetKey, planet]}
					{#if !data.includes(planetKey)}
						<option value={planetKey}>{planet.icon} {planet.label}</option>
					{/if}
				{/each}
			</select>
			<button
				type="button"
				class="button submit"
				onclick={() => {
					if (selectedPlanet && Array.isArray(data) && !data.includes(selectedPlanet)) {
						data.push(selectedPlanet);
						selectedPlanet = ''; // Reset after adding
					}
				}}
			>
				Adicionar
			</button>
		</div>
	{:else if isDispositor}
		<!-- Automatically update the dispositor based on the current sign -->
		<PlanetInput
			{keyName}
			data={chartData.planets[
				keyName === 'partFortuneDispositor'
					? getPartFortuneDispositor()
					: getPartSubstanceDispositor()
			]}
		/>
	{:else}
		<AstroPosition {keyName} {data} />
		{#if isPlanet}
			<RetrogradeInput {showRetrograde} {keyName} {data} />
		{/if}
	{/if}
</fieldset>
