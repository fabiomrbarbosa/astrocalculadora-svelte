<script lang="ts">
	import { chartData } from '$lib/chartData.svelte';

	let { houses, planetPositions, ascendant } = $props();

	type Glyph = { name: string; glyph: string };

	export const signs: Glyph[] = [
		{ name: 'Aries', glyph: 'A' },
		{ name: 'Taurus', glyph: 'B' },
		{ name: 'Gemini', glyph: 'C' },
		{ name: 'Cancer', glyph: 'D' },
		{ name: 'Leo', glyph: 'E' },
		{ name: 'Virgo', glyph: 'F' },
		{ name: 'Libra', glyph: 'G' },
		{ name: 'Scorpio', glyph: 'H' },
		{ name: 'Sagittarius', glyph: 'I' },
		{ name: 'Capricorn', glyph: 'J' },
		{ name: 'Aquarius', glyph: 'K' },
		{ name: 'Pisces', glyph: 'L' }
	];

	export const planets: Glyph[] = [
		{ name: 'Sun', glyph: 'Q' },
		{ name: 'Moon', glyph: 'R' },
		{ name: 'Mercury', glyph: 'S' },
		{ name: 'Venus', glyph: 'T' },
		{ name: 'Mars', glyph: 'U' },
		{ name: 'Jupiter', glyph: 'V' },
		{ name: 'Saturn', glyph: 'W' },
		{ name: 'NorthNode', glyph: 'g' },
		{ name: 'SouthNode', glyph: 'i' },
		{ name: 'Fortune', glyph: '?' },
		{ name: 'ASC', glyph: '↑' }
	];

	type Aspect = {
		name: string;
		offset: number;
		glyph: string;
	};

	const aspects: Aspect[] = [
		{ name: 'sextile', offset: 2, glyph: '%' },
		{ name: 'square', offset: 3, glyph: '#' },
		{ name: 'trine', offset: 4, glyph: '$' },
		{ name: 'opposition', offset: 6, glyph: '"' }
	];

	const signIndex = (signName: string): number =>
		signs.findIndex((s) => s.name.toLowerCase() === signName.toLowerCase());

	const getPlanetGlyph = (planetName: string): string =>
		planets.find((p) => p.name.toLowerCase() === planetName.toLowerCase())?.glyph ?? '';
</script>

<div class="table-container table-speculum">
	<table class="table text-center">
		<thead class="sticky">
			<tr>
				<th>°</th>
				{#each signs as sign}
					<th class="font-astronomicon text-2xl font-normal" title={sign.name}>
						{sign.glyph}
					</th>
				{/each}
				<th>°</th>
			</tr>
		</thead>
		<tbody>
			{#each Array.from({ length: 30 }, (_, deg) => deg) as degree}
				<tr>
					<td>{degree}º</td>
					{#each signs as sign, sIdx}
						<td>
							<!-- Planets -->
							{#each Object.entries(planetPositions) as [planet, pos]}
								{#if signIndex(pos.signName) === sIdx && Math.floor(pos.position.degrees) === degree}
									<div class="text-accent" title={planet}>
										<span class="font-astronomicon text-lg">! {getPlanetGlyph(planet)}</span>
										<span class="text-xs">{pos.position.minutes}'</span>
									</div>
								{/if}
							{/each}

							<!-- House cusps -->
							{#each houses as cusp, index}
								{#if Math.floor(cusp % 30) === degree && Math.floor(cusp / 30) === sIdx}
									<div class="text-primary text-xs font-bold">C{index + 1}</div>
								{/if}
							{/each}

							<!-- Aspects -->
							{#each Object.entries(planetPositions) as [planet, pos]}
								{#each aspects as { name, offset, glyph }}
									{#if Math.floor(pos.position.degrees) === degree && ((signIndex(pos.signName) + offset) % 12 === sIdx || (signIndex(pos.signName) - offset + 12) % 12 === sIdx)}
										<div
											class="font-astronomicon text-lg text-gray-400"
											title={`${name} a ${planet}`}
										>
											{glyph}
											{getPlanetGlyph(planet)}
										</div>
									{/if}
								{/each}
							{/each}
						</td>
					{/each}
					<td>{degree}º</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
