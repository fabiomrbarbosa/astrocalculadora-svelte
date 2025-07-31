<script lang="ts">
	import { calculateAlmutemSubstance } from '$lib/calcs';
	import { chartData } from '$lib/chartData.svelte';
	import { resourceSignifiers, signs } from '$lib/staticData';

	import AstroInput from '$lib/components/AstroInput.svelte';
	import usePreventDefault from '$lib/actions/usePreventDefault';
	import { getBreakdownScores } from '$lib/utils';

	// Reverse planet keys for proper column order
	const planetKeys = Object.keys(chartData.planets).reverse();
</script>

<!-- Almutem of Substance Form -->
<div class="panel">
	<form class="form" onsubmit={calculateAlmutemSubstance} use:usePreventDefault>
		<AstroInput keyName="house2Cusp" data={chartData.houses.house2.cusp} />
		<AstroInput keyName="house2Ruler" data={chartData.houses.house2.ruler} />
		<AstroInput keyName="house2Planets" data={chartData.houses.house2.planets} />
		<AstroInput keyName="partFortune" data={chartData.points.partFortune} />
		<AstroInput keyName="partFortuneDispositor" data={chartData.partFortuneDispositor} />
		<AstroInput keyName="partSubstance" data={chartData.points.partSubstance} />
		<AstroInput keyName="partSubstanceDispositor" data={chartData.partSubstanceDispositor} />
		<AstroInput keyName="jupiter" data={chartData.planets.jupiter} />

		<button class="submit">Calcular Almutem da Substância</button>
	</form>
	<!-- Result -->

	{#if Object.keys(chartData.results.almutemSubstance.scores).length > 0}
		<div class="table-container">
			<table class="table">
				<thead>
					<tr>
						<th>Significadores</th>
						{#each planetKeys as planetKey}
							<th class="font-astronomicon text-lg"
								>{chartData.planets[planetKey].iconReplacement}</th
							>
						{/each}
					</tr>
				</thead>
				<tbody>
					<!-- Iterate over all resourceSignifiers dynamically -->
					{#each Object.entries(resourceSignifiers) as [key, { label }]}
						{#if key === 'house2Planets'}
							<!-- Special handling for multiple planets in House 2 -->
							{#each chartData.houses.house2.planets as planet}
								<tr>
									<td>{chartData.planets[planet].label} (Casa 2)</td>
									{#each planetKeys as planetKey}
										<td
											>{getBreakdownScores(
												planetKey,
												`${planet}_house2_planets`,
												'almutemSubstance'
											)}</td
										>
									{/each}
								</tr>
							{/each}
						{:else}
							<tr>
								<td>{label}</td>
								{#each planetKeys as planetKey}
									<td>{getBreakdownScores(planetKey, key, 'almutemSubstance')}</td>
								{/each}
							</tr>
						{/if}
					{/each}

					<!-- Grand Total -->
					<tr>
						<td><strong>Total</strong></td>
						{#each planetKeys as planetKey}
							<td>{chartData.results.almutemSubstance.scores?.[planetKey] || ''}</td>
						{/each}
					</tr>
				</tbody>
			</table>
		</div>
	{/if}
</div>
