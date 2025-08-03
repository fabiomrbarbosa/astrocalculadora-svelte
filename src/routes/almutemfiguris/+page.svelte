<script lang="ts">
	import { calculateAlmutemFiguris } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import { hylegicPoints, planets } from '$lib/staticData';

	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
	import { getBreakdownScores } from '$lib/utils';

	// Reverse planet keys for proper column order
	const planetKeys = Object.keys(chartData.planets).reverse();
</script>

<!-- Almutem Figuris Form -->
<div class="panel">
	<form class="form" onsubmit={calculateAlmutemFiguris} use:usePreventDefault>
		<AstroInput keyName="sun" bind:data={chartData.planets.sun} />
		<AstroInput keyName="moon" bind:data={chartData.planets.moon} />
		<AstroInput keyName="ascendant" bind:data={chartData.points.ascendant} />
		<AstroInput keyName="partFortune" bind:data={chartData.points.partFortune} />
		<AstroInput keyName="syzygy" bind:data={chartData.points.syzygy} />

		<!-- Positions per House -->
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Posições por Casa</legend>
			<div class="flex flex-col gap-2 lg:flex-row">
				{#each Object.entries(chartData.planets) as [planet]}
					<div class="house-field w-full">
						<label class="select w-full">
							<span class="label">{planets[planet].icon}</span>
							<select id="{planet}House" bind:value={chartData.planets[planet].house}>
								{#each Array.from({ length: 12 }, (_, i) => i + 1) as n}
									<option value={n} selected={n === chartData.planets[planet].house}
										>Casa {n}</option
									>
								{/each}
							</select>
						</label>
					</div>
				{/each}
			</div>
		</fieldset>

		<div class="flex flex-col gap-4 md:flex-row">
			<!-- Rulers of Day/Night -->
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Regente do Dia/da Noite</legend>
				<select bind:value={chartData.rulerOfDay} class="select w-full">
					{#each Object.entries(planets) as [planetKey, planet]}
						<option value={planetKey}>{planet.icon} {planet.label}</option>
					{/each}
				</select>
			</fieldset>

			<!-- Ruler of the Hour -->
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Regente da Hora</legend>
				<select bind:value={chartData.rulerOfHour} class="select w-full">
					{#each Object.entries(planets) as [planetKey, planet]}
						<option value={planetKey}>{planet.icon} {planet.label}</option>
					{/each}
				</select>
			</fieldset>
		</div>

		<button class="submit">Calcular Almutem Figuris</button>
	</form>

	<!-- Result -->
	{#if Object.keys(chartData.results.almutemFiguris.scores).length > 0}
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th>Pontos Hilégicos</th>
						{#each planetKeys as planetKey}
							<th class="font-astronomicon text-lg">
								{planets[planetKey].iconReplacement}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					<!-- Hylegic Point Scores -->
					{#each Object.keys(hylegicPoints) as hylegic}
						<tr>
							<td>{hylegicPoints[hylegic].label}</td>
							{#each planetKeys as planetKey}
								<td>
									{#if chartData.results.almutemFiguris.scoreBreakdown?.[planetKey]?.some( (b: string) => b.includes(hylegic) )}
										<span>
											{getBreakdownScores(planetKey, hylegic, 'almutemFiguris')}
										</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}

					<!-- Subtotal Row for Dignity-Based Scores -->
					<tr>
						<td><strong>Subtotal (Dignidades)</strong></td>
						{#each planetKeys as planetKey}
							<td>{chartData.results.almutemFiguris.dignitySubtotal[planetKey]}</td>
						{/each}
					</tr>

					<!-- House Placement Scores -->
					<tr>
						<td>Posição por Casa</td>
						{#each planetKeys as planetKey}
							<td>{chartData.results.almutemFiguris.houseScores?.[planetKey] || ''}</td>
						{/each}
					</tr>

					<!-- Ruler of the Day -->
					<tr>
						<td>Regente do Dia/Noite</td>
						{#each planetKeys as planetKey}
							<td>{chartData.results.almutemFiguris.rulerOfDay === planetKey ? 7 : ''}</td>
						{/each}
					</tr>

					<!-- Ruler of the Hour -->
					<tr>
						<td>Regente da Hora</td>
						{#each planetKeys as planetKey}
							<td>{chartData.results.almutemFiguris.rulerOfHour === planetKey ? 6 : ''}</td>
						{/each}
					</tr>

					<!-- Grand Total -->
					<tr>
						<td><strong>Total</strong></td>
						{#each planetKeys as planetKey}
							<td>{chartData.results.almutemFiguris.scores?.[planetKey]}</td>
						{/each}
					</tr>
				</tbody>
			</table>
		</div>
	{/if}
</div>
