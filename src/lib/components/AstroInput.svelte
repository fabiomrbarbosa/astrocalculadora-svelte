<script lang="ts">
	import { chartData } from '$lib/chartData.svelte';
	import { planets, points } from '$lib/staticData';
	import PositionInput from './PositionInput.svelte';
	import PlanetInput from './PlanetInput.svelte';

	let { keyName, showRetrograde = false, data = $bindable() } = $props();

	// Check what kind of data we're dealing with based on the `keyName`
	const isCusp = keyName.includes('Cusp'); // House cusps
	const isRuler = keyName.includes('Ruler'); // House ruler
	const isPlanetArray = keyName.includes('Planets'); // List of planets in house
	const isDispositor = keyName.includes('Dispositor'); // Precomputed ruler (read-only)
	const isPlanet = keyName in chartData.planets; // A single planet
	const isPoint = keyName in chartData.points; // A single calculated point

	let selectedPlanet = $state('');

	// Compute which planet is actually the dispositor
	const dispositorKey =
		keyName === 'partFortuneDispositor'
			? chartData.partFortuneDispositor
			: chartData.partSubstanceDispositor;
</script>

<fieldset class="fieldset">
	<legend class="fieldset-legend">
		{#if isCusp}Cúspide da {keyName.replace('Cusp', '').replace('house', '')}ª Casa
		{:else if isRuler}Regente da {keyName.replace('Ruler', '').replace('house', '')}ª Casa
		{:else if isPlanetArray}Planetas na {keyName.replace('Planets', '').replace('house', '')}ª Casa
		{:else if isDispositor}Dispositor da {points[keyName.replace('Dispositor', '')].label}
		{:else if isPoint}
			{points[keyName].label}
		{:else if isPlanet}
			{planets[keyName].label}
		{/if}
	</legend>

	{#if isRuler}
		<!-- House Ruler Dropdown -->
		<label class="select w-full">
			<span class="label">Regente</span>
			<select
				id={keyName}
				name={keyName}
				bind:value={chartData.houses[keyName.replace('Ruler', '')].ruler}
			>
				<option value="" disabled selected>Selecione um planeta</option>
				{#each Object.entries(planets) as [planetKey, planet]}
					<option value={planetKey}>{planet.icon} {planet.label}</option>
				{/each}
			</select>
		</label>

		<!-- Render Ruler Inputs if a Ruler is Selected -->
		{#if chartData.houses[keyName.replace('Ruler', '')]?.ruler}
			<PlanetInput
				keyName={chartData.houses[keyName.replace('Ruler', '')].ruler}
				bind:data={chartData.planets[chartData.houses[keyName.replace('Ruler', '')]?.ruler]}
			/>
		{/if}
	{:else if isPlanetArray}
		<!-- List of Planets in House -->
		{#each data as planetKey, index}
			<div class="flex w-full flex-col gap-2">
				<!-- 🪐 Planet name header -->
				<div class="planet-name mb-1 font-semibold">
					{planets[planetKey].label}
				</div>
				<div class="flex gap-2 md:flex-row">
					<PlanetInput keyName={planetKey} bind:data={chartData.planets[planetKey]} />
					<button type="button" class="submit--danger w-full" onclick={() => data.splice(index, 1)}>
						✕
					</button>
				</div>
			</div>
		{/each}

		<!-- Add Planet Dropdown -->
		<div class="flex flex-col gap-2 md:flex-row">
			<select bind:value={selectedPlanet} class="select w-full">
				<option value="" disabled selected>Adicionar um planeta</option>
				{#each Object.entries(planets) as [planetKey, planet]}
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
		<!-- 🪐 Dispositor name header -->
		<div class="planet-name mb-1 font-semibold">
			{chartData.planets[dispositorKey].label}
		</div>
		<PlanetInput keyName={dispositorKey} bind:data={chartData.planets[dispositorKey]} />
	{:else if isPlanet}
		<PlanetInput {showRetrograde} {keyName} bind:data />
	{:else}
		<PositionInput {keyName} bind:data />
	{/if}
</fieldset>
