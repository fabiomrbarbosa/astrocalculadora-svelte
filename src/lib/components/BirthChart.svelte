<script lang="ts">
	import { onMount } from 'svelte';
	import { chartData } from '$lib/chartData.svelte';

	let svgRef: SVGSVGElement | null = null;

	onMount(() => {
		if (svgRef) {
			chartData.renderedChart = svgRef.outerHTML;
		}
	});

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

	const houseCuspLabelRadiusOuter = zodiacInner;
	const houseCuspLabelRadiusInner = zodiacInner - 20;
	const houseCuspLabelRadius = (houseCuspLabelRadiusOuter + houseCuspLabelRadiusInner) / 2;

	const planetRingInner = houseCuspLabelRadiusInner - 30;
	const planetRingOuter = planetRingInner + 30;

	const clearRadiusInner = size / 6;
	const houseNumberRadius = clearRadiusInner + 20;
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
	let rotationOffset =
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

	const degreeTicks = zodiacMarkers.flatMap(({ start }, signIndex) =>
		Array.from({ length: 30 }, (_, i) => {
			const absoluteDegree = (start + i) % 360;
			const isLong = i % 10 === 0;
			const tickLength = isLong ? 10 : 5;

			return {
				angle: absoluteDegree,
				startRadius: zodiacInner,
				endRadius: zodiacInner + tickLength
			};
		})
	);

	const houseCuspLabels = houses.map((cusp, i) => {
		const angle = (cusp + rotationOffset) % 360;
		const degrees = Math.floor(cusp % 30);
		const minutes = Math.floor(((cusp % 30) - degrees) * 60);
		const signIndex = Math.floor(cusp / 30) % 12;

		// Layout override
		let layout: 'arc' | 'stack' | 'arc-flipped' = 'arc';
		if (i === 0 || i === 6)
			layout = 'stack'; // 1st and 7th cusp
		else if (i >= 7 && i <= 11) layout = 'arc-flipped'; // 8th–11th

		return {
			angle,
			degrees: `${degrees}°`,
			sign: signGlyphs[signIndex],
			minutes: `${minutes.toString().padStart(2, '0')}'`,
			layout,
			index: i
		};
	});
</script>

<svg
	bind:this={svgRef}
	viewBox={`0 0 ${size} ${size}`}
	preserveAspectRatio="xMidYMid meet"
	style="width: 100%; height: auto; display: block;"
>
	<!-- Zodiac Ring Label Belt -->
	<circle
		id="chart-outer-border"
		cx={center}
		cy={center}
		r={zodiacOuter + 4}
		stroke="#333"
		stroke-width="0.5"
		fill="none"
	/>
	<circle
		id="chart-zodiac-outer"
		cx={center}
		cy={center}
		r={zodiacOuter}
		stroke="#333"
		stroke-width="0.5"
		fill="none"
	/>
	<circle
		id="chart-zodiac-inner"
		cx={center}
		cy={center}
		r={zodiacInner}
		stroke="#333"
		stroke-width="0.5"
		fill="none"
	/>

	<!-- Sign Division Lines -->
	{#each zodiacMarkers as marker}
		{@const outer = polarToCartesian(center, center, zodiacOuter, marker.start)}
		{@const inner = polarToCartesian(center, center, zodiacInner, marker.start)}
		<line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#333" stroke-width="0.5" />
	{/each}

	<!-- Sign Glyphs -->
	{#each zodiacMarkers as marker}
		{@const mid = polarToCartesian(center, center, (zodiacOuter + zodiacInner) / 2, marker.mid)}
		<text x={mid.x} y={mid.y + 6} text-anchor="middle" alignment-baseline="middle" font-size="16">
			{marker.glyph}
		</text>
	{/each}

	<!-- Degree Ticks -->
	{#each degreeTicks as tick}
		{@const inner = polarToCartesian(center, center, tick.startRadius, tick.angle)}
		{@const outer = polarToCartesian(center, center, tick.endRadius, tick.angle)}

		<line
			class="chart-degree-tick"
			x1={inner.x}
			y1={inner.y}
			x2={outer.x}
			y2={outer.y}
			stroke="#444"
			stroke-width="0.5"
		/>
	{/each}

	<!-- House Cusp Label Ring -->
	<circle
		id="chart-houselabel-outer"
		cx={center}
		cy={center}
		r={houseCuspLabelRadiusOuter}
		stroke="#333"
		stroke-width="0.5"
		fill="none"
	/>

	<defs>
		{#each houseCuspLabels as cusp}
			{@const angleStart = cusp.angle - 5}
			{@const angleEnd = cusp.angle + 5}
			{@const largeArcFlag = Math.abs(angleEnd - angleStart) <= 180 ? 0 : 1}

			{#if cusp.layout === 'arc-flipped'}
				{@const start = polarToCartesian(center, center, houseCuspLabelRadius, angleEnd)}
				{@const end = polarToCartesian(center, center, houseCuspLabelRadius, angleStart)}
				<path
					id={`arc-label-${cusp.index}`}
					fill="none"
					stroke="none"
					d={`M ${start.x} ${start.y} A ${houseCuspLabelRadius} ${houseCuspLabelRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
				/>
			{:else}
				{@const start = polarToCartesian(center, center, houseCuspLabelRadius, angleStart)}
				{@const end = polarToCartesian(center, center, houseCuspLabelRadius, angleEnd)}
				<path
					id={`arc-label-${cusp.index}`}
					fill="none"
					stroke="none"
					d={`M ${start.x} ${start.y} A ${houseCuspLabelRadius} ${houseCuspLabelRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`}
				/>
			{/if}
		{/each}
	</defs>

	{#each houseCuspLabels as cusp}
		{#if cusp.layout === 'stack'}
			{@const pos = polarToCartesian(center, center, houseCuspLabelRadius, cusp.angle)}
			<g transform={`translate(${pos.x}, ${pos.y})`}>
				<text y="-12" font-size="10" text-anchor="middle">{cusp.degrees}</text>
				<text y="0" font-size="10" text-anchor="middle">{cusp.sign}</text>
				<text y="12" font-size="10" text-anchor="middle">{cusp.minutes}</text>
			</g>
		{:else}
			<text font-size="10" fill="#111">
				<textPath
					xlink:href={`#arc-label-${cusp.index}`}
					startOffset="50%"
					text-anchor="middle"
					dominant-baseline="middle"
				>
					{cusp.degrees}
					{cusp.sign}
					{cusp.minutes}
				</textPath>
			</text>
		{/if}
	{/each}

	<!-- Planet Ring Boundary -->
	<circle
		id="chart-planetspoints-outer"
		cx={center}
		cy={center}
		r={planetRingOuter}
		fill="none"
		stroke="#333"
		stroke-width="0.5"
	/>

	<!-- House Cusps -->
	{#each houses as cusp, i}
		{@const angle = (cusp + rotationOffset) % 360}
		{@const pos = polarToCartesian(center, center, planetRingInner + 30, angle)}
		{@const inner = polarToCartesian(center, center, clearRadiusInner, angle)}

		<line
			x1={inner.x}
			y1={inner.y}
			x2={pos.x}
			y2={pos.y}
			stroke="#333"
			stroke-width={i === 0 || i === 3 || i === 6 || i === 9 ? 2.5 : 0.5}
		/>
	{/each}

	<!-- Planet Points -->
	{#each Object.entries(planetPositions) as [name, point]}
		{#if point.position}
			{@const angle = (point.position.longitude + rotationOffset) % 360}

			{@const pos = polarToCartesian(center, center, planetRingInner, angle)}
			<text x={pos.x} y={pos.y - 4} font-size="14" text-anchor="middle">
				{planetGlyphs[name] ?? name}
			</text>
			<text x={pos.x} y={pos.y + 10} font-size="10" fill="gray" text-anchor="middle">
				{point.position.degrees}°
				{signGlyphs[point.signNumber - 1]}
				{point.position.minutes.toString().padStart(2, '0')}
				{point.retrograde ? '℞' : ''}
			</text>
		{/if}
	{/each}

	<!-- ASC Marker -->
	{#if ascendant?.position?.longitude}
		{@const angle = (ascendant.position.longitude + rotationOffset) % 360}

		{@const asc = polarToCartesian(center, center, planetRingInner + 18, angle)}
		<text x={asc.x} y={asc.y} font-size="16" text-anchor="middle" fill="red">
			{planetGlyphs.ASC}
		</text>
	{/if}

	<!-- House Number Ring -->
	<circle
		id="chart-housenumber-outer"
		cx={center}
		cy={center}
		r={houseNumberRadius}
		fill="none"
		stroke="#333"
		stroke-width="0.5"
	/>

	<!-- House Numbers -->
	{#each houses as cusp, i}
		{@const nextCusp = houses[(i + 1) % 12]}
		{@const angle = (midpointAngle(cusp, nextCusp) + rotationOffset) % 360}
		{@const pos = polarToCartesian(center, center, houseNumberRadius - 12, angle)}

		<text x={pos.x} y={pos.y + 4} font-size="10" text-anchor="middle" alignment-baseline="middle">
			{houseNumbers[i]}
		</text>
	{/each}

	<!-- Inner Clear Boundary -->
	<circle
		id="chart-inner-border"
		cx={center}
		cy={center}
		r={clearRadiusInner}
		fill="none"
		stroke="#333"
		stroke-width="0.5"
	/>
</svg>

<style>
	svg {
		font-family: 'Noto Sans Symbols', 'Symbola', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif;
		line-height: 1;
	}
</style>
