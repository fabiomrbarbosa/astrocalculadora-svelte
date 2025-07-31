<script lang="ts">
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

	const planetMap = Object.fromEntries(planets.map((p) => [p.name, p.glyph]));

	let {
		houses,
		planetPositions,
		ascendant,
		dayNight,
		dayRuler,
		hourRuler,
		usedCoordinates,
		usedTimezone
	} = $props();

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

	function midpointAngle(a: number, b: number): number {
		const diff = ((b - a + 360) % 360) / 2;
		return (a + diff) % 360;
	}

	let rotationOffset = $derived(
		ascendant?.position?.longitude != null ? (0 - ascendant.position.longitude + 360) % 360 : 0
	);

	function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
		const rad = (180 - angle) * (Math.PI / 180);
		return {
			x: cx + r * Math.cos(rad),
			y: cy + r * Math.sin(rad)
		};
	}

	const zodiacMarkers = $derived(
		signs.map((sign, i) => {
			const start = (i * 30 + rotationOffset) % 360;
			return {
				start,
				mid: (start + 15) % 360,
				glyph: sign.glyph,
				name: sign.name
			};
		})
	);

	const degreeTicks = $derived(
		zodiacMarkers.flatMap(({ start }, signIndex) =>
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
		)
	);

	const houseCuspLabels = $derived(
		houses.map((cusp, i) => {
			const angle = (cusp + rotationOffset) % 360;
			const degrees = Math.floor(cusp % 30);
			const minutes = Math.floor(((cusp % 30) - degrees) * 60);
			const signIndex = Math.floor(cusp / 30) % 12;

			return {
				angle,
				degrees: `${degrees}°`,
				sign: signs[signIndex].glyph,
				signName: signs[signIndex].name,
				minutes: `${minutes.toString().padStart(2, '0')}'`,
				index: i
			};
		})
	);
</script>

<svg
	class="color-base-content"
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
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	<circle
		id="chart-zodiac-outer"
		cx={center}
		cy={center}
		r={zodiacOuter}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	<circle
		id="chart-zodiac-inner"
		cx={center}
		cy={center}
		r={zodiacInner}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>

	<!-- Sign Division Lines -->
	{#each zodiacMarkers as marker}
		{@const outer = polarToCartesian(center, center, zodiacOuter, marker.start)}
		{@const inner = polarToCartesian(center, center, zodiacInner, marker.start)}
		<line
			x1={inner.x}
			y1={inner.y}
			x2={outer.x}
			y2={outer.y}
			class="stroke-current"
			stroke-width="0.5"
		/>
	{/each}

	<!-- Sign Glyphs -->
	{#each zodiacMarkers as marker}
		{@const mid = polarToCartesian(center, center, (zodiacOuter + zodiacInner) / 2, marker.mid)}
		<text
			class="font-astronomicon fill-current birth-chart__{marker.name.toLowerCase()}"
			x={mid.x}
			y={mid.y}
			font-size="22"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{marker.glyph}
		</text>
	{/each}

	<!-- Degree Ticks -->
	{#each degreeTicks as tick}
		{@const inner = polarToCartesian(center, center, tick.startRadius, tick.angle)}
		{@const outer = polarToCartesian(center, center, tick.endRadius, tick.angle)}

		<line
			class="chart-degree-tick stroke-current"
			x1={inner.x}
			y1={inner.y}
			x2={outer.x}
			y2={outer.y}
			stroke-width="0.5"
		/>
	{/each}

	<!-- House Cusp Label Ring -->
	<circle
		id="chart-houselabel-outer"
		cx={center}
		cy={center}
		r={houseCuspLabelRadiusOuter}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>

	{#each houseCuspLabels as cusp}
		{@const baseRadius = houseCuspLabelRadius}
		{@const angleOffset = 4}
		{@const angle = cusp.angle}
		{@const reversed = cusp.index >= 6}
		<!-- Houses 7–12 (indexes 6–11) -->

		<!-- Calculate angles conditionally -->
		{@const degreesAngle = reversed ? angle + angleOffset : angle - angleOffset}
		{@const signAngle = angle}
		{@const minutesAngle = reversed ? angle - angleOffset : angle + angleOffset}

		<!-- Positions along the ring -->
		{@const degreesPos = polarToCartesian(center, center, baseRadius, degreesAngle)}
		{@const signPos = polarToCartesian(center, center, baseRadius, signAngle)}
		{@const minutesPos = polarToCartesian(center, center, baseRadius, minutesAngle)}

		<!-- Degrees -->
		<text
			class="fill-current"
			x={degreesPos.x}
			y={degreesPos.y}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{cusp.degrees}
		</text>

		<!-- Sign Glyph -->
		<text
			class="font-astronomicon fill-current"
			x={signPos.x}
			y={signPos.y}
			font-size="14"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{cusp.sign}
		</text>

		<!-- Minutes -->
		<text
			class="fill-current"
			x={minutesPos.x}
			y={minutesPos.y}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{cusp.minutes}
		</text>
	{/each}

	<!-- Planet Ring Boundary -->
	<circle
		id="chart-planetspoints-outer"
		cx={center}
		cy={center}
		r={planetRingOuter}
		class="fill-none stroke-current"
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
			class="stroke-current"
			stroke-width={i === 0 || i === 3 || i === 6 || i === 9 ? 2.5 : 0.5}
		/>
	{/each}

	<!-- Planet Points -->
	{#each Object.entries(planetPositions) as [name, point]}
		{#if point.position}
			{@const angle = (point.position.longitude + rotationOffset) % 360}

			<!-- Ticks -->
			{@const tickOuterStart = polarToCartesian(center, center, planetRingOuter, angle)}
			{@const tickOuterEnd = polarToCartesian(center, center, planetRingOuter - 6, angle)}
			{@const tickInnerStart = polarToCartesian(center, center, houseNumberRadius, angle)}
			{@const tickInnerEnd = polarToCartesian(center, center, houseNumberRadius + 6, angle)}

			<!-- Outer Tick -->
			<line
				x1={tickOuterStart.x}
				y1={tickOuterStart.y}
				x2={tickOuterEnd.x}
				y2={tickOuterEnd.y}
				class="stroke-current"
				stroke-width="0.5"
			/>

			<!-- Inner Tick -->
			<line
				x1={tickInnerStart.x}
				y1={tickInnerStart.y}
				x2={tickInnerEnd.x}
				y2={tickInnerEnd.y}
				class="stroke-current"
				stroke-width="0.5"
			/>

			<!-- Radial staggering parameters -->
			{@const glyphRadius = planetRingOuter - 20}
			<!-- closer to outer ring -->
			{@const radialStep = 16}
			<!-- spacing between sub-elements -->

			<!-- Positions calculated radially -->
			{@const glyphPos = polarToCartesian(center, center, glyphRadius, angle)}
			{@const degreesPos = polarToCartesian(center, center, glyphRadius - radialStep * 1.35, angle)}
			{@const signPos = polarToCartesian(center, center, glyphRadius - radialStep * 2.45, angle)}
			{@const minutesPos = polarToCartesian(center, center, glyphRadius - radialStep * 3.5, angle)}
			{@const retrogradePos = polarToCartesian(
				center,
				center,
				glyphRadius - radialStep * 4.5,
				angle
			)}

			<!-- Planet Glyph -->
			<text
				class="font-astronomicon fill-current birth-chart__{name.toLowerCase()}"
				x={glyphPos.x}
				y={glyphPos.y}
				font-size="24"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{planetMap[name] ?? name}
			</text>

			<!-- Degrees -->
			<text
				class="fill-current"
				x={degreesPos.x}
				y={degreesPos.y}
				font-size="12"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{point.position.degrees}°
			</text>

			<!-- Sign Glyph -->
			<text
				class="font-astronomicon fill-current"
				x={signPos.x}
				y={signPos.y}
				font-size="16"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{signs[point.signNumber - 1].glyph}
			</text>

			<!-- Minutes -->
			<text
				class="fill-current"
				x={minutesPos.x}
				y={minutesPos.y}
				font-size="10"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{point.position.minutes.toString().padStart(2, '0')}'
			</text>

			<!-- Retrograde -->
			{#if point.retrograde}
				<text
					class="fill-current"
					x={retrogradePos.x}
					y={retrogradePos.y}
					font-size="10"
					text-anchor="middle"
					dominant-baseline="central"
				>
					℞
				</text>
			{/if}
		{/if}
	{/each}

	<!-- House Number Ring -->
	<circle
		id="chart-housenumber-outer"
		cx={center}
		cy={center}
		r={houseNumberRadius}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>

	<!-- House Numbers -->
	{#each houses as cusp, i}
		{@const nextCusp = houses[(i + 1) % 12]}
		{@const angle = (midpointAngle(cusp, nextCusp) + rotationOffset) % 360}
		{@const pos = polarToCartesian(center, center, houseNumberRadius - 10, angle)}

		<text
			class="fill-current"
			x={pos.x}
			y={pos.y}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="central"
		>
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
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
</svg>
