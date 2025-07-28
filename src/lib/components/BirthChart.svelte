<script lang="ts">
	export let houses;
	export let planetPositions;
	export let ascendant;
	export let usedCoordinates;
	export let usedTimezone;

	const size = 600;
	const center = size / 2;
	const outerRadius = center - 20;
	const zodiacOuter = outerRadius;
	const zodiacInner = zodiacOuter - 30;
	const houseRing = zodiacInner - 5;
	const planetRing = houseRing - 25;

	const innerClearRadius = size / 6;
	const houseLabelRadius = innerClearRadius + 20;
	const houseNumbers = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

	// Compute midpoint between two angles
	function midpointAngle(a: number, b: number): number {
		const diff = ((b - a + 360) % 360) / 2;
		return (a + diff) % 360;
	}

	const signGlyphs = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
	const planetGlyphs: Record<string, string> = {
		Sun: '☉',
		Moon: '☽',
		Mercury: '☿',
		Venus: '♀',
		Mars: '♂',
		Jupiter: '♃',
		Saturn: '♄',
		NorthNode: '☊',
		SouthNode: '☋',
		ASC: '↑'
	};

	// Rotate chart so that ASC is at 180° (left)
	const rotationOffset =
		ascendant?.position?.longitude != null ? (0 - ascendant.position.longitude + 360) % 360 : 0;

	function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
		const rad = (180 - angle) * (Math.PI / 180);

		return {
			x: cx + r * Math.cos(rad),
			y: cy + r * Math.sin(rad)
		};
	}

	const zodiacMarkers = Array.from({ length: 12 }, (_, i) => {
		const start = (i * 30 + rotationOffset) % 360;
		return {
			start,
			mid: (start + 15) % 360,
			glyph: signGlyphs[i]
		};
	});
</script>

<svg
	viewBox={`0 0 ${size} ${size}`}
	preserveAspectRatio="xMidYMid meet"
	style="width: 100%; height: auto; display: block;"
>
	<!-- Sign Division Lines -->
	{#each zodiacMarkers as marker}
		{@const outer = polarToCartesian(center, center, zodiacOuter, marker.start)}
		{@const inner = polarToCartesian(center, center, zodiacInner, marker.start)}
		<line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#333" stroke-width="1" />
	{/each}

	<!-- Zodiac Ring Label Belt -->
	<circle cx={center} cy={center} r={zodiacOuter} stroke="#333" fill="none" />
	<circle cx={center} cy={center} r={zodiacInner} stroke="#333" fill="none" />

	{#each zodiacMarkers as marker}
		{@const mid = polarToCartesian(center, center, (zodiacOuter + zodiacInner) / 2, marker.mid)}
		<text x={mid.x} y={mid.y + 6} text-anchor="middle" alignment-baseline="middle" font-size="16">
			{marker.glyph}
		</text>
	{/each}

	<!-- House Cusps -->
	{#each houses as cusp, i}
		{@const angle = (cusp + rotationOffset) % 360}
		{@const pos = polarToCartesian(center, center, planetRing + 30, angle)}
		{@const inner = polarToCartesian(center, center, innerClearRadius, angle)}

		<line
			x1={inner.x}
			y1={inner.y}
			x2={pos.x}
			y2={pos.y}
			stroke="#333"
			stroke-width={i === 0 || i === 3 || i === 6 || i === 9 ? 2.5 : 1}
		/>
	{/each}

	<!-- House Label Ring -->
	<circle cx={center} cy={center} r={houseLabelRadius} fill="none" stroke="#333" />

	<!-- Inner Clear Boundary -->
	<circle cx={center} cy={center} r={innerClearRadius} fill="none" stroke="#333" stroke-width="1" />

	<!-- House Numbers -->
	{#each houses as cusp, i}
		{@const nextCusp = houses[(i + 1) % 12]}
		{@const angle = (midpointAngle(cusp, nextCusp) + rotationOffset) % 360}
		{@const pos = polarToCartesian(center, center, houseLabelRadius - 12, angle)}

		<text x={pos.x} y={pos.y + 3} font-size="12" text-anchor="middle" alignment-baseline="middle">
			{houseNumbers[i]}
		</text>
	{/each}

	<!-- Planet Points -->
	{#each Object.entries(planetPositions) as [name, point]}
		{#if point.position}
			{@const angle = (point.position.longitude + rotationOffset) % 360}

			{@const pos = polarToCartesian(center, center, planetRing, angle)}
			<text x={pos.x} y={pos.y - 4} font-size="14" text-anchor="middle">
				{planetGlyphs[name] ?? name}
			</text>
			<text x={pos.x} y={pos.y + 10} font-size="10" fill="gray" text-anchor="middle">
				{point.position.degrees}°
				{point.position.minutes.toString().padStart(2, '0')}
				{signGlyphs[point.signNumber - 1]}
				{point.retrograde ? '℞' : ''}
			</text>
		{/if}
	{/each}

	<!-- ASC Marker -->
	{#if ascendant?.position?.longitude}
		{@const angle = (ascendant.position.longitude + rotationOffset) % 360}

		{@const asc = polarToCartesian(center, center, planetRing + 18, angle)}
		<text x={asc.x} y={asc.y} font-size="16" text-anchor="middle" fill="red">
			{planetGlyphs.ASC}
		</text>
	{/if}

	<!-- Chart Boundary -->
	<circle cx={center} cy={center} r={planetRing + 30} stroke="#333" fill="none" />
</svg>

<style>
	svg {
		font-family: 'Noto Sans Symbols', 'Symbola', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif;
		line-height: 1;
	}
</style>
