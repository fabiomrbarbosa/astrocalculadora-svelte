<script lang="ts">
	import { calculateAlmutemFiguris } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import { hylegicPoints } from '$lib/staticData';

	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
	import { getBreakdownScores } from '$lib/utils';

	// Reverse planet keys for proper column order
	const planetKeys = Object.keys(chartData.planets).reverse();
</script>

<!-- Almutem Figuris Form -->
<div class="panel">
	<form class="form" onsubmit={calculateAlmutemFiguris} use:usePreventDefault>
		<AstroInput keyName="sun" data={chartData.planets.sun} />
		<AstroInput keyName="moon" data={chartData.planets.moon} />
		<AstroInput keyName="ascendant" data={chartData.points.ascendant} />
		<AstroInput keyName="partFortune" data={chartData.points.partFortune} />
		<AstroInput keyName="syzygy" data={chartData.points.syzygy} />

		<!-- Positions per House -->
		<div class="house-placements">
			<label for="housePlacements" class="fieldset-label">Posições por Casa</label>
			<fieldset id="housePlacements" class="house-placements-fields">
				{#each Object.entries(chartData.planets) as [planet]}
					<div class="flex gap-2">
						<label for="{planet}House" class="label">{chartData.planets[planet].icon}</label>
						<select id="{planet}House" bind:value={chartData.planets[planet].house} class="select">
							{#each Array.from({ length: 12 }, (_, i) => i + 1) as n}
								<option value={n} selected={n === chartData.planets[planet].house}>Casa {n}</option>
							{/each}
						</select>
					</div>
				{/each}
			</fieldset>
		</div>

		<fieldset class="fieldset">
			<!-- Rulers of Day/Night -->
			<div class="rulers-of-day-hour">
				<label for="rulerOfDayNight" class="fieldset-label">Regente do Dia/da Noite</label>
				<div id="rulerOfDayNight">
					<select bind:value={chartData.rulerOfDay} class="select">
						{#each Object.entries(chartData.planets) as [planetKey, planet]}
							<option value={planetKey}>{planet.icon} {planet.label}</option>
						{/each}
					</select>
				</div>

				<!-- Ruler of the Hour -->
				<div class="rulers-of-day-hour">
					<label for="rulerOfHour" class="fieldset-label">Regente da Hora</label>
					<div id="rulerOfHour">
						<select bind:value={chartData.rulerOfHour} class="select">
							{#each Object.entries(chartData.planets) as [planetKey, planet]}
								<option value={planetKey}>{planet.icon} {planet.label}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</fieldset>

		<button class="submit">Calcular Almutem Figuris</button>
	</form>

	<!-- Result -->
	{#if Object.keys(chartData.results.almutemFiguris.scores).length > 0}
		<div class="result">
			<table class="almutem-table almutem-table--figuris">
				<thead>
					<tr>
						<th>Pontos Hilégicos</th>
						{#each planetKeys as planetKey}
							<th>{chartData.planets[planetKey].icon}</th>
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
