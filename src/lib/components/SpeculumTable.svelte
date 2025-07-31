<script lang="ts">
	import { signs as signData } from '$lib/staticData';

	let { houses, planetPositions, ascendant } = $props();

	type Glyph = { name: string; label: string; glyph: string };

	// Sign glyphs for table headers
	const signGlyphs: Glyph[] = [
		{ name: 'Aries', label: 'Carneiro', glyph: 'A' },
		{ name: 'Taurus', label: 'Touro', glyph: 'B' },
		{ name: 'Gemini', label: 'Gémeos', glyph: 'C' },
		{ name: 'Cancer', label: 'Caranguejo', glyph: 'D' },
		{ name: 'Leo', label: 'Leão', glyph: 'E' },
		{ name: 'Virgo', label: 'Virgem', glyph: 'F' },
		{ name: 'Libra', label: 'Balança', glyph: 'G' },
		{ name: 'Scorpio', label: 'Escorpião', glyph: 'H' },
		{ name: 'Sagittarius', label: 'Sagitário', glyph: 'I' },
		{ name: 'Capricorn', label: 'Capricórnio', glyph: 'J' },
		{ name: 'Aquarius', label: 'Aquário', glyph: 'K' },
		{ name: 'Pisces', label: 'Peixes', glyph: 'L' }
	];

	const signList = Object.keys(signData); // For indexing and accessing term data

	export const planets: Glyph[] = [
		{ name: 'Sun', label: 'Sol', glyph: 'Q' },
		{ name: 'Moon', label: 'Lua', glyph: 'R' },
		{ name: 'Mercury', label: 'Mercúrio', glyph: 'S' },
		{ name: 'Venus', label: 'Vénus', glyph: 'T' },
		{ name: 'Mars', label: 'Marte', glyph: 'U' },
		{ name: 'Jupiter', label: 'Júpiter', glyph: 'V' },
		{ name: 'Saturn', label: 'Saturno', glyph: 'W' },
		{ name: 'NorthNode', label: 'Nodo Norte', glyph: 'g' },
		{ name: 'SouthNode', label: 'Nodo Sul', glyph: 'i' },
		{ name: 'Fortune', label: 'Parte da Fortuna', glyph: '?' },
		{ name: 'ASC', label: 'Ascendente', glyph: '↑' }
	];

	type Aspect = {
		name: string;
		label: string;
		offset: number;
		glyph: string;
	};

	const aspects: Aspect[] = [
		{ name: 'sextile', label: 'Sextil', offset: 2, glyph: '%' },
		{ name: 'square', label: 'Quadratura', offset: 3, glyph: '#' },
		{ name: 'trine', label: 'Trígono', offset: 4, glyph: '$' },
		{ name: 'opposition', label: 'Oposição', offset: 6, glyph: '"' }
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

	const getPlanetLabel = (planetName: string): string =>
		planets.find((p) => p.name.toLowerCase() === planetName.toLowerCase())?.label ?? '';

	const getCuspMinutes = (cusp: number): number => {
		let deg = Math.floor(cusp % 30);
		return Math.floor(((cusp % 30) - deg) * 60);
	};
</script>

<div class="table-container table-speculum">
	<table class="table text-center">
		<thead>
			<tr>
				<th>°</th>
				{#each signGlyphs as sign}
					<th class="font-astronomicon text-2xl font-normal" title={sign.label}>
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
									<div class="speculum__term text-sm" title={`Termo de ${getPlanetLabel(ruler)}`}>
										T. <span class="font-astronomicon text-lg">{getPlanetGlyph(ruler)}</span>
									</div>
								{/if}
							{/each}

							<!-- House cusps -->
							{#each houses as cusp, index}
								{#if Math.floor(cusp % 30) === degree && Math.floor(cusp / 30) === sIdx}
									<div class="text-primary text-xs">
										<span class="speculum__house-cusp font-bold">
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
										<span class="speculum__house-minutes">
											{`• ` + getCuspMinutes(cusp) + `'`}
										</span>
									</div>
								{/if}
							{/each}

							<!-- Planets -->
							{#each Object.entries(planetPositions) as [planet, pos]}
								{#if signIndex(pos.signName) === sIdx && Math.floor(pos.position.degrees) === degree}
									<div class="text-accent" title={`${getPlanetLabel(planet)}`}>
										<span class="font-astronomicon text-lg">! {getPlanetGlyph(planet)}</span>
										<span class="text-xs">{pos.position.minutes}'</span>
									</div>
								{/if}
							{/each}

							<!-- Aspects from planets -->
							{#each Object.entries(planetPositions) as [planet, pos]}
								{#if planet !== 'NorthNode' && planet !== 'SouthNode'}
									{#each aspects as { name, label, offset, glyph }}
										{#if Math.floor(pos.position.degrees) === degree && ((signIndex(pos.signName) + offset) % 12 === sIdx || (signIndex(pos.signName) - offset + 12) % 12 === sIdx)}
											<div
												class={`font-astronomicon text-lg ${getAspectClass(name)}`}
												title={`${label} a ${getPlanetLabel(planet)}`}
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
								{#each aspects.filter((a) => a.name !== 'opposition') as { name, label, offset, glyph }}
									{#if Math.floor(houses[houseIndex] % 30) === degree && ((Math.floor(houses[houseIndex] / 30) + offset) % 12 === sIdx || (Math.floor(houses[houseIndex] / 30) - offset + 12) % 12 === sIdx)}
										<div
											class={`${getAspectClass(name)}`}
											title={`${label} a ${houseIndex === 0 ? 'ASC' : 'MC'}`}
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
