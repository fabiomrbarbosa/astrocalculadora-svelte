<script lang="ts">
	//–– Glyph definitions
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

	//–– Props (including our two new tuning knobs)
	let {
		houses,
		planetPositions,
		ascendant,
		dayNight,
		dayRuler,
		hourRuler,
		usedCoordinates,
		usedTimezone,
		labelOffsetStep = 4, // degrees to push each additional clustered planet
		clusterSpacingThreshold = 5 // max° gap to consider “clustered”
	} = $props();

	//–– Geometry constants
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

	//–– Helpers
	function midpointAngle(a: number, b: number): number {
		const diff = ((b - a + 360) % 360) / 2;
		return (a + diff) % 360;
	}

	function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
		const rad = (180 - angle) * (Math.PI / 180);
		return {
			x: cx + r * Math.cos(rad),
			y: cy + r * Math.sin(rad)
		};
	}

	//–– Base rotation so ascendant is at 0°
	let rotationOffset = $derived(
		ascendant?.position?.longitude != null ? (0 - ascendant.position.longitude + 360) % 360 : 0
	);

	//–– Zodiac markers, degree ticks, house‐cusp labels (unchanged) …
	const zodiacMarkers = $derived(
		signs.map((sign, i) => {
			const start = (i * 30 + rotationOffset) % 360;
			return { start, mid: (start + 15) % 360, glyph: sign.glyph, name: sign.name };
		})
	);

	const degreeTicks = $derived(
		zodiacMarkers.flatMap(({ start }) =>
			Array.from({ length: 30 }, (_, i) => {
				const absoluteDegree = (start + i) % 360;
				const isLong = i % 10 === 0;
				return {
					angle: absoluteDegree,
					startRadius: zodiacInner,
					endRadius: zodiacInner + (isLong ? 10 : 5)
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

	//–– NEW: compute a bumped‐angle for each planet label to avoid overlap
	const adjustedPlanetAngles = $derived.by(() => {
		// 1. build list of actual longitudes
		const list = Object.entries(planetPositions)
			.filter(([, pt]) => pt.position)
			.map(([name, pt]) => ({
				name,
				orig: (pt.position.longitude + rotationOffset) % 360
			}));

		// 2. sort ascending
		list.sort((a, b) => a.orig - b.orig);

		// 3. handle wrap‐around cluster at 360°→0°
		if (list.length) {
			const first = list[0].orig;
			const last = list[list.length - 1].orig;
			if (first + 360 - last < clusterSpacingThreshold) {
				list[0].orig += 360;
				list.sort((a, b) => a.orig - b.orig);
			}
		}

		// 4. walk and bump tightly spaced neighbors
		const result: Record<string, number> = {};
		let prevOrig: number | null = null;
		let clusterCount = 0;

		for (const { name, orig } of list) {
			if (prevOrig !== null && orig - prevOrig < clusterSpacingThreshold) {
				clusterCount += 1;
			} else {
				clusterCount = 0;
			}
			const bumped = orig + clusterCount * labelOffsetStep;
			// mod back into [0,360)
			result[name] = ((bumped % 360) + 360) % 360;
			prevOrig = orig;
		}

		return result;
	});
</script>

<svg
	class="color-base-content"
	viewBox={`0 0 ${size} ${size}`}
	preserveAspectRatio="xMidYMid meet"
	style="width: 100%; height: auto; display: block;"
>
	<!-- Zodiac outer/inner rings -->
	<circle
		cx={center}
		cy={center}
		r={zodiacOuter + 4}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	<circle
		cx={center}
		cy={center}
		r={zodiacOuter}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	<circle
		cx={center}
		cy={center}
		r={zodiacInner}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>

	<!-- Sign dividers & glyphs -->
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

	<!-- Degree ticks -->
	{#each degreeTicks as tick, i}
		{#if i % 30 !== 0}
			{@const inner = polarToCartesian(center, center, tick.startRadius, tick.angle)}
			{@const outer = polarToCartesian(center, center, tick.endRadius, tick.angle)}
			<line
				x1={inner.x}
				y1={inner.y}
				x2={outer.x}
				y2={outer.y}
				class="chart-degree-tick stroke-current"
				stroke-width="0.5"
			/>
		{/if}
	{/each}

	<!-- House cusp labels -->
	<circle
		cx={center}
		cy={center}
		r={houseCuspLabelRadiusOuter}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	{#each houseCuspLabels as cusp}
		{@const base = houseCuspLabelRadius}
		{@const off = 4}
		{@const rev = cusp.index >= 6}
		{@const angDeg = rev ? cusp.angle + off : cusp.angle - off}
		{@const angSign = cusp.angle}
		{@const angMin = rev ? cusp.angle - off : cusp.angle + off}
		{@const posDeg = polarToCartesian(center, center, base, angDeg)}
		{@const posSign = polarToCartesian(center, center, base, angSign)}
		{@const posMin = polarToCartesian(center, center, base, angMin)}

		<text
			class="fill-current"
			x={posDeg.x}
			y={posDeg.y}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{cusp.degrees}
		</text>
		<text
			class="font-astronomicon fill-current"
			x={posSign.x}
			y={posSign.y}
			font-size="14"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{cusp.sign}
		</text>
		<text
			class="fill-current"
			x={posMin.x}
			y={posMin.y}
			font-size="10"
			text-anchor="middle"
			dominant-baseline="central"
		>
			{cusp.minutes}
		</text>
	{/each}

	<!-- Planet ring & house cusp lines -->
	<circle
		cx={center}
		cy={center}
		r={planetRingOuter}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	{#each houses as cusp, i}
		{@const a = (cusp + rotationOffset) % 360}
		{@const pInner = polarToCartesian(center, center, clearRadiusInner, a)}
		{@const pOuter = polarToCartesian(center, center, planetRingInner + 30, a)}
		<line
			x1={pInner.x}
			y1={pInner.y}
			x2={pOuter.x}
			y2={pOuter.y}
			class="stroke-current"
			stroke-width={i % 3 === 0 ? 2.5 : 0.5}
		/>
	{/each}

	<!-- Planet points & labels -->
	{#each Object.entries(planetPositions) as [name, point]}
		{#if point.position}
			{@const angle = (point.position.longitude + rotationOffset) % 360}
			{@const labelAngle = adjustedPlanetAngles[name]}

			<!-- Outer tick -->
			{@const o1 = polarToCartesian(center, center, planetRingOuter, angle)}
			{@const o2 = polarToCartesian(center, center, planetRingOuter - 6, angle)}
			<line x1={o1.x} y1={o1.y} x2={o2.x} y2={o2.y} class="stroke-current" stroke-width="0.5" />

			<!-- Inner tick -->
			{@const i1 = polarToCartesian(center, center, houseNumberRadius, angle)}
			{@const i2 = polarToCartesian(center, center, houseNumberRadius + 6, angle)}
			<line x1={i1.x} y1={i1.y} x2={i2.x} y2={i2.y} class="stroke-current" stroke-width="0.5" />

			<!-- Radial staggering -->
			{@const glyphRadius = planetRingOuter - 20}
			{@const radialStep = 16}

			<!-- Label placements at bumped angle -->
			{@const gp = polarToCartesian(center, center, glyphRadius, labelAngle)}
			{@const dp = polarToCartesian(center, center, glyphRadius - radialStep * 1.35, labelAngle)}
			{@const sp = polarToCartesian(center, center, glyphRadius - radialStep * 2.45, labelAngle)}
			{@const mp = polarToCartesian(center, center, glyphRadius - radialStep * 3.5, labelAngle)}
			{@const rp = polarToCartesian(center, center, glyphRadius - radialStep * 4.5, labelAngle)}

			<!-- Planet glyph -->
			<text
				class="font-astronomicon fill-current birth-chart__{name.toLowerCase()}"
				x={gp.x}
				y={gp.y}
				font-size="24"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{planetMap[name] ?? name}
			</text>

			<!-- Degrees -->
			<text
				class="fill-current"
				x={dp.x}
				y={dp.y}
				font-size="12"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{point.position.degrees}°
			</text>

			<!-- Sign glyph -->
			<text
				class="font-astronomicon fill-current"
				x={sp.x}
				y={sp.y}
				font-size="16"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{signs[point.signNumber - 1].glyph}
			</text>

			<!-- Minutes -->
			<text
				class="fill-current"
				x={mp.x}
				y={mp.y}
				font-size="10"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{point.position.minutes.toString().padStart(2, '0')}'
			</text>

			<!-- Retrograde marker -->
			{#if point.retrograde}
				<text
					class="fill-current"
					x={rp.x}
					y={rp.y}
					font-size="10"
					text-anchor="middle"
					dominant-baseline="central"
				>
					℞
				</text>
			{/if}
		{/if}
	{/each}

	<!-- House numbers -->
	<circle
		cx={center}
		cy={center}
		r={houseNumberRadius}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
	{#each houses as cusp, i}
		{@const next = houses[(i + 1) % 12]}
		{@const ang = (midpointAngle(cusp, next) + rotationOffset) % 360}
		{@const pos = polarToCartesian(center, center, houseNumberRadius - 10, ang)}
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

	<!-- Inner clear circle -->
	<circle
		cx={center}
		cy={center}
		r={clearRadiusInner}
		class="fill-none stroke-current"
		stroke-width="0.5"
	/>
</svg>
