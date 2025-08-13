<script lang="ts">
	import { planets, signs, aspects, points } from '$lib/staticData';
	import type { PlanetPosition } from '$lib/types';

	let { houses, planetPositions, partOfFortune } = $props();

	function toCamelCase(str: string): string {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}

	// Values and derived
	const getSignData = (key: keyof typeof signs) => signs[key];

	const signList = Object.entries(signs).map(([key, p]) => ({
		key,
		label: p.label,
		glyph: p.iconReplacement
	}));

	const aspectList = Object.entries(aspects).map(([key, a]) => ({
		name: key,
		label: a.name,
		glyph: a.iconReplacement,
		offset: a.signsApart
	}));

	const getAspectClass = (name: string): string =>
		name === 'sextile' || name === 'trine'
			? 'text-info'
			: name === 'square' || name === 'opposition'
				? 'text-error'
				: 'text-base-content';

	const signIndex = (signName: string): number => {
		return Object.values(signs).findIndex((s) => s.value.toLowerCase() === signName.toLowerCase());
	};

	const getPlanetGlyph = (name: string): string => {
		const key = toCamelCase(name);
		return (
			planets[key as keyof typeof planets]?.iconReplacement ??
			points[key as keyof typeof points]?.iconReplacement ??
			''
		);
	};

	const getPlanetLabel = (name: string): string => {
		const lower = name.toLowerCase();
		return (
			planets[lower as keyof typeof planets]?.label ??
			points[lower as keyof typeof points]?.label ??
			''
		);
	};

	const getCuspMinutes = (cusp: number): number => {
		let deg = Math.floor(cusp % 30);
		return Math.floor(((cusp % 30) - deg) * 60);
	};
</script>

<div class="table-container table-speculum lg:col-span-3">
	<table class="table text-center">
		<thead>
			<tr>
				<th>°</th>
				{#each signList as sign}
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
					{#each signList as sign, sIdx}
						<td>
							<!-- Term markers -->
							{#each Object.entries(getSignData(signList[sIdx].key).dignities.terms) as [termDeg, ruler]}
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
								{@const p = pos as PlanetPosition}
								{#if signIndex(p.signName) === sIdx && Math.floor(p.position.degrees) === degree}
									<div class="text-accent" title={`${getPlanetLabel(planet)}`}>
										<span class="font-astronomicon text-lg">! {getPlanetGlyph(planet)}</span>
										<span class="text-xs">{p.position.minutes}'</span>
									</div>
								{/if}
							{/each}

							<!-- Part of Fortune -->
							{#if partOfFortune && signIndex(partOfFortune.signName) === sIdx && Math.floor(partOfFortune.position.degrees) === degree}
								<div class="text-accent" title={getPlanetLabel('partFortune')}>
									<span class="font-astronomicon text-lg">! {getPlanetGlyph('partFortune')}</span>
									<span class="text-xs">{partOfFortune.position.minutes}'</span>
								</div>
							{/if}

							<!-- Aspects from planets -->
							{#each [...Object.entries(planetPositions), ['partFortune', partOfFortune]] as [planet, pos]}
								{#if pos && planet !== 'NorthNode' && planet !== 'SouthNode'}
									{#each aspectList.filter((a) => a.name !== 'conjunction') as { name, label, offset: offsets, glyph }}
										{#each offsets as offset}
											{#if Math.floor(pos.position.degrees) === degree}
												{@const signNum = signIndex(pos.signName)}
												{#if (signNum + offset) % 12 === sIdx}
													<div
														class={`font-astronomicon text-lg ${getAspectClass(name)}`}
														title={`${label} a ${getPlanetLabel(planet)}`}
													>
														<span>{glyph}</span>
														<span>{getPlanetGlyph(planet)}</span>
													</div>
												{/if}
											{/if}
										{/each}
									{/each}
								{/if}
							{/each}

							<!-- Aspects to ASC and MC (no opposition) -->
							{#each [0, 9] as houseIndex}
								{@const houseDeg = Math.floor(houses[houseIndex])}
								{@const houseSign = Math.floor(houseDeg / 30)}
								{@const houseDegInSign = houseDeg % 30}

								{#each aspectList.filter((a) => a.name !== 'opposition' && a.name !== 'conjunction') as { name, label, offset: offsets, glyph }}
									{#each offsets as offset}
										{#if degree === houseDegInSign && (houseSign + offset) % 12 === sIdx}
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
							{/each}
						</td>
					{/each}
					<td>{degree}º</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
