<script lang="ts">
	import { chartData } from '$lib/chartData.svelte';
	import { signs as signData } from '$lib/staticData';

	let { houses, planetPositions, ascendant } = $props();

	type Glyph = { name: string; glyph: string };

	// Sign glyphs for table headers
	const signGlyphs: Glyph[] = [
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

	const signList = Object.keys(signData); // For indexing and accessing term data

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

	const getAspectClass = (name: string): string =>
		name === 'sextile' || name === 'trine'
			? 'text-info'
			: name === 'square' || name === 'opposition'
				? 'text-error'
				: 'text-base-content';

	const signIndex = (signName: string): number =>
		signGlyphs.findIndex((s) => s.name.toLowerCase() === signName.toLowerCase());

	const getPlanetGlyph = (planetName: string): string =>
		planets.find((p) => p.name.toLowerCase() === planetName.toLowerCase())?.glyph ?? '';
</script>

<div class="table-container table-speculum">
	<table class="table text-center">
		<thead>
			<tr>
				<th>°</th>
				{#each signGlyphs as sign}
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
					{#each signGlyphs as sign, sIdx}
						<td>
							<!-- Term markers -->
							{#each Object.entries(signData[signList[sIdx]].dignities.terms) as [termDeg, ruler]}
								{#if +termDeg === degree}
									<div class="speculum__term text-sm" title={`Termo de ${ruler}`}>
										T. <span class="font-astronomicon text-lg">{getPlanetGlyph(ruler)}</span>
									</div>
								{/if}
							{/each}

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
									<div class="text-primary text-xs font-bold">
										<span class="speculum__house-cusp">
											{index === 0
												? 'ASC'
												: index === 3
													? 'IC'
													: index === 6
														? 'DES'
														: index === 9
															? 'MC'
															: `C${index + 1}`}</span
										>
									</div>
								{/if}
							{/each}

							<!-- Aspects from planets -->
							{#each Object.entries(planetPositions) as [planet, pos]}
								{#if planet !== 'NorthNode' && planet !== 'SouthNode'}
									{#each aspects as { name, offset, glyph }}
										{#if Math.floor(pos.position.degrees) === degree && ((signIndex(pos.signName) + offset) % 12 === sIdx || (signIndex(pos.signName) - offset + 12) % 12 === sIdx)}
											<div
												class={`font-astronomicon text-lg ${getAspectClass(name)}`}
												title={`${name} a ${planet}`}
											>
												{glyph}
												{getPlanetGlyph(planet)}
											</div>
										{/if}
									{/each}
								{/if}
							{/each}

							<!-- Aspects to ASC and MC (no opposition) -->
							{#each [0, 9] as houseIndex}
								{#each aspects.filter((a) => a.name !== 'opposition') as { name, offset, glyph }}
									{#if Math.floor(houses[houseIndex] % 30) === degree && ((Math.floor(houses[houseIndex] / 30) + offset) % 12 === sIdx || (Math.floor(houses[houseIndex] / 30) - offset + 12) % 12 === sIdx)}
										<div
											class={`${getAspectClass(name)}`}
											title={`${name} a ${houseIndex === 0 ? 'ASC' : 'MC'}`}
										>
											<span class="font-astronomicon text-lg">{glyph} </span>
											<span>{houseIndex === 0 ? 'ASC' : 'MC'}</span>
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
