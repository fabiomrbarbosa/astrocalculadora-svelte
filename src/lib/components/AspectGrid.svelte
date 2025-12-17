<script lang="ts">
	import { planets, points, aspects as aspectDefs } from '$lib/staticData';

	let { aspects } = $props();

	const cellSize = 56; // pixels per cell — scalable; also serves as header offset

	const PLANET_KEYS = ['moon', 'mercury', 'venus', 'sun', 'mars', 'jupiter', 'saturn'];
	const PLANETS = PLANET_KEYS.map((key) => ({
		label: planets[key].label,
		iconReplacement: planets[key].iconReplacement
	}));

	PLANETS.push(
		{ label: 'ASC', iconReplacement: points.ascendant.iconReplacement! },
		{ label: 'MC', iconReplacement: points.midheaven.iconReplacement! }
	);

	// Columns exclude MC so angles don't appear as a column-aspect target and the grid width matches cells
	const COL_PLANETS = PLANETS.slice(0, -1);
	// Headers include MC, but MC is rendered above the last real column (ASC)
	const HEADER_PLANETS = PLANETS;
	const ROW_PLANETS = PLANETS.slice(1); // exclude the Moon

	let aspectMap = $derived.by(() => {
		const map = new Map();
		for (const row of PLANETS) {
			map.set(row.label, new Map());
		}
		for (const a of aspects) {
			const p1 = normalizeLabel(a.planet1);
			const p2 = normalizeLabel(a.planet2);
			if (map.has(p1)) map.get(p1).set(p2, a);
			if (map.has(p2)) map.get(p2).set(p1, a);
		}
		return map;
	});

	const aspectDefsByIcon = Object.values(aspectDefs).reduce(
		(acc, def) => {
			acc[def.icon] = def;
			return acc;
		},
		{} as Record<string, (typeof aspectDefs)[keyof typeof aspectDefs]>
	);

	const iconToAspectNameMap: Record<string, string> = Object.values(aspectDefs).reduce(
		(acc, def) => {
			acc[def.icon] = def.name;
			return acc;
		},
		{} as Record<string, string>
	);

	function normalizeLabel(name: string): string {
		return name.replace(' ℞', '').trim(); // remove retrograde symbol
	}
</script>

<svg
	id="aspects-grid"
	viewBox={`0 0 ${COL_PLANETS.length * cellSize + cellSize} ${ROW_PLANETS.length * cellSize + cellSize + cellSize / 4}`}
	preserveAspectRatio="xMidYMid meet"
	class="h-auto w-full fill-current text-center"
>
	<!-- Column headers, staggered -->
	{#each HEADER_PLANETS as planet, i}
		{@const headerColIndex = Math.min(i, COL_PLANETS.length - 1)}
		<text
			x={headerColIndex * cellSize + cellSize + cellSize / 2}
			y={(i - 1) * cellSize + cellSize + cellSize / 2}
			text-anchor="middle"
			dominant-baseline="central"
			class="font-astronomicon text-4xl"
		>
			{planet.iconReplacement}
		</text>
	{/each}

	<!-- Row headers -->
	{#each ROW_PLANETS as planet, i}
		<text
			x={cellSize / 2}
			y={i * cellSize + cellSize + cellSize / 2}
			text-anchor="middle"
			dominant-baseline="central"
			class="font-astronomicon text-4xl"
		>
			{planet.iconReplacement}
		</text>
	{/each}
	<!-- Optimized cell gridlines for lower triangle -->
	{#each ROW_PLANETS as row, i}
		{#each COL_PLANETS as col, j}
			{@const cellEnabled = j < i + 1 && !(row.label === 'MC' && col.label === 'ASC')}
			{@const lastEnabledJ = row.label === 'MC' ? i - 1 : i}
			{#if cellEnabled}
				<!-- Left line -->
				<line
					x1={j * cellSize + cellSize}
					y1={i * cellSize + cellSize}
					x2={j * cellSize + cellSize}
					y2={i * cellSize + cellSize + cellSize}
					stroke="currentColor"
					stroke-width="0.5"
				/>

				<!-- Add right border only for last column in row -->
				{#if j === lastEnabledJ}
					<line
						x1={j * cellSize + cellSize + cellSize}
						y1={i * cellSize + cellSize}
						x2={j * cellSize + cellSize + cellSize}
						y2={i * cellSize + cellSize + cellSize}
						stroke="currentColor"
						stroke-width="0.5"
					/>
				{/if}

				<!-- Top border: always drawn -->
				<line
					x1={j * cellSize + cellSize}
					y1={i * cellSize + cellSize}
					x2={j * cellSize + cellSize + cellSize}
					y2={i * cellSize + cellSize}
					stroke="currentColor"
					stroke-width="0.5"
				/>

				<!-- Bottom border: only for last row -->
				{#if i === ROW_PLANETS.length - 1}
					<line
						x1={j * cellSize + cellSize}
						y1={i * cellSize + cellSize + cellSize}
						x2={j * cellSize + cellSize + cellSize}
						y2={i * cellSize + cellSize + cellSize}
						stroke="currentColor"
						stroke-width="0.5"
					/>
				{/if}
			{/if}
		{/each}
	{/each}

	<!-- Aspect glyphs -->
	{#each ROW_PLANETS as row, i}
		{#each COL_PLANETS as col, j}
			{@const cellEnabled = j < i + 1 && !(row.label === 'MC' && col.label === 'ASC')}
			{#if cellEnabled}
				{@const a = aspectMap.get(row.label)?.get(col.label)}
				{#if a}
					<!-- Aspect glyph -->
					<text
						x={j * cellSize + cellSize + cellSize / 2}
						y={i * cellSize + cellSize + cellSize / 2}
						text-anchor="middle"
						class="font-astronomicon text-4xl"
						class:fill-stone-400={a.outOfSign}
					>
						<title>{`${a.planet1} ${iconToAspectNameMap[a.icon]} a ${a.planet2}`}</title>
						{aspectDefsByIcon[a.icon]?.iconReplacement ?? a.icon}
					</text>

					<!-- Orb -->
					<text
						x={j * cellSize + cellSize + cellSize / 2}
						y={i * cellSize + cellSize + cellSize / 2 + 16}
						text-anchor="middle"
						class="text-xs"
						class:fill-stone-400={a.outOfSign}
					>
						{a.orb}{a.applying?.[0] ?? ''}
					</text>
				{/if}
			{/if}
		{/each}
	{/each}
</svg>
