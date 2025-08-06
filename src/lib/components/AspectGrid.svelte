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

	const COL_PLANETS = PLANETS;
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
	viewBox={`0 0 ${PLANETS.length * cellSize + cellSize} ${PLANETS.length * cellSize + cellSize / 4}`}
	preserveAspectRatio="xMidYMid meet"
	class="h-auto w-full fill-current text-center"
>
	<!-- Column headers, staggered -->
	{#each COL_PLANETS as planet, i}
		<text
			x={i * cellSize + cellSize + cellSize / 2}
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
			{#if j < i + 1}
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
				{#if j === i}
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
			{#if j < i + 1}
				{@const a = aspectMap.get(row.label)?.get(col.label)}
				{#if a}
					<text
						x={j * cellSize + cellSize + cellSize / 2}
						y={i * cellSize + cellSize + cellSize / 2}
						text-anchor="middle"
						dominant-baseline="central"
						class:fill-gray-500={a.outOfSign}
					>
						<title>{`${a.planet1} ${iconToAspectNameMap[a.icon]} a ${a.planet2}`}</title>
						<tspan class="font-astronomicon text-4xl" dy="-0.2em">{a.icon}</tspan>
						{#if a.outOfSign}
							<tspan class="text-sm">(D)</tspan>
						{/if}
						<tspan x={j * cellSize + cellSize + cellSize / 2} dy="1.4em" class="text-xs"
							>{a.orb}</tspan
						>
					</text>
				{/if}
			{/if}
		{/each}
	{/each}
</svg>
