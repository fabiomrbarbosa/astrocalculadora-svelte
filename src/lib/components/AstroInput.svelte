<script>
	import { chartData } from '$lib/store.svelte';
	import PlanetInput from './PlanetInput.svelte';
	import AstroPosition from './AstroPosition.svelte';

	export let keyName; // e.g., "house2Cusp", "house2Ruler", "house2Planets", "partFortune"
	export let data; // The actual object (cusp, ruler, planets[], point, dispositor)

	// Check what kind of data we're dealing with based on the `keyName`
	const isCusp = keyName.includes('Cusp'); // House cusps
	const isRuler = keyName.includes('Ruler'); // House ruler
	const isPlanetArray = keyName.includes('Planets'); // List of planets in house
	const isDispositor = keyName.includes('Dispositor'); // Precomputed ruler (read-only)
	const isPlanet = keyName in chartData.planets; // A single planet
	const isPoint = keyName in chartData.points; // A single calculated point
</script>

<fieldset class="fieldset border-base-300 rounded-box bg-base-100 w-xs border p-4">
	<legend class="fieldset-legend">
		{#if isCusp}Cúspide da {keyName.replace('Cusp', '').replace('house', '')}ª Casa{/if}
		{#if isRuler}Regente da {keyName.replace('Ruler', '').replace('house', '')}ª Casa{/if}
		{#if isPlanetArray}Planetas na {keyName.replace('Planets', '').replace('house', '')}ª Casa{/if}
		{#if isPlanet || isPoint}{data.label}{/if}
		{#if isDispositor}Dispositor da {keyName.replace('Dispositor', '')}{/if}
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
				<button type="button" class="submit submit--danger" on:click={() => data.splice(index, 1)}
					>✕</button
				>
			</div>
		{/each}

		<!-- Add Planet Dropdown -->
		<div class="flex gap-2">
			<select bind:value={chartData.newPlanet} class="select">
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
				on:click={() => chartData.newPlanet && data.push(chartData.newPlanet)}>Adicionar</button
			>
		</div>
	{:else if isPlanet || isPoint}
		<!-- If it's a Planet or Calculated Point -->
		<PlanetInput {keyName} {data} />
	{:else if isDispositor}
		<!-- Dispositor Dropdown  -->
		<PlanetInput
			{keyName}
			data={chartData.planets[chartData.points[keyName.replace('Dispositor', '')].dispositor]}
		/>
	{:else if isCusp}
		<!-- House Cusp -->
		<AstroPosition {keyName} {data} />
	{/if}
</fieldset>
