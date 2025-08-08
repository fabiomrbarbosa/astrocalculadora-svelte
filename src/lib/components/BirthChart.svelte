<script lang="ts">
	import { signs, planets, points } from '$lib/staticData';

	// Props and derived values
	let {
		meta,
		planetPositions,
		partOfFortune,
		houses,
		ascendant,
		usedCoordinates,
		usedTimezone,
		dayNight,
		dayRuler,
		hourRuler
	} = $props();

	let dateObj = $derived.by(() => new Date(meta.utcTime));
	let localizedWeekday = $derived.by(() =>
		new Intl.DateTimeFormat('pt-PT', { weekday: 'long' }).format(dateObj)
	);
	let localizedDate = $derived.by(() =>
		new Intl.DateTimeFormat('pt-PT', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		}).format(dateObj)
	);

	// Glyph and position definitions
	const unifiedPlanetPositions = $derived.by(() => {
		return {
			...planetPositions,
			NorthNode: points.northNode && planetPositions?.NorthNode,
			SouthNode: points.southNode && planetPositions?.SouthNode,
			PartOfFortune: partOfFortune
				? {
						position: partOfFortune.position,
						signNumber: partOfFortune.signNumber,
						signName: partOfFortune.signName
					}
				: undefined
		};
	});

	const signList = Object.values(signs);
	const planetGlyphs = Object.entries(planets)
		.map(([name, p]) => ({
			name: p.value,
			glyph: p.iconReplacement
		}))
		.concat([
			{ name: 'NorthNode', glyph: points.northNode!.iconReplacement! },
			{ name: 'SouthNode', glyph: points.southNode!.iconReplacement! },
			{ name: 'PartOfFortune', glyph: points.partFortune!.iconReplacement! }
		]);

	const planetMap = Object.fromEntries(planetGlyphs.map((p) => [p.name, p.glyph]));

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

	const labelOffsetStep = 4; // degrees to push each additional clustered planet
	const clusterSpacingThreshold = 5; // max° gap to consider “clustered”

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

	function toDMS(deg: number, isLat: boolean): string {
		const abs = Math.abs(deg);
		const degrees = Math.floor(abs);
		const minutes = Math.round((abs - degrees) * 60);
		const direction = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
		return `${degrees}°${direction}${minutes}'`;
	}

	//–– Base rotation so ascendant is at 0°
	let rotationOffset: number = $derived(
		ascendant?.position?.longitude != null ? (0 - ascendant.position.longitude + 360) % 360 : 0
	);

	//–– Zodiac markers, degree ticks, house‐cusp labels (unchanged) …
	const zodiacMarkers = $derived(
		Object.entries(signs).map(([key, sign], i: number) => {
			const start = (i * 30 + rotationOffset) % 360;
			return {
				start,
				mid: (start + 15) % 360,
				glyph: sign.iconReplacement,
				name: sign.value
			};
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

	const houseCuspLabels = $derived.by(() => {
		if (!houses) return [];
		return houses.map((cusp: number, i) => {
			const angle = (cusp + rotationOffset) % 360;
			const degrees = Math.floor(cusp % 30);
			const minutes = Math.floor(((cusp % 30) - degrees) * 60);
			const signIndex = Math.floor(cusp / 30) % 12;
			const signData = signList[signIndex];

			return {
				angle,
				degrees: `${degrees.toString().padStart(2, '0')}º`,
				sign: signData.iconReplacement,
				signName: signData.label,
				minutes: `${minutes.toString().padStart(2, '0')}'`,
				index: i
			};
		});
	});

	//–– Compute a bumped‐angle for each planet label to avoid overlap
	function isNearCusp(deg: number, cuspDeg: number, threshold = 3) {
		const diff = Math.abs((deg - cuspDeg + 360) % 360);
		return diff < threshold || 360 - diff < threshold;
	}

	const adjustedPlanetAngles = $derived.by(() => {
		const processed = Object.entries(unifiedPlanetPositions)
			.filter(([, pt]) => pt.position)
			.map(([name, pt]) => {
				const raw = pt.position.longitude;
				const angle = (raw + rotationOffset) % 360;
				const sign = Math.floor(raw / 30);
				const houseIndex = houses.findIndex((h, i) => {
					const next = houses[(i + 1) % 12];
					return (h <= raw && raw < next) || (next < h && (raw >= h || raw < next));
				});
				return { name, raw, angle, sign, houseIndex };
			});

		const sectorMap = new Map<string, typeof processed>();
		for (const p of processed) {
			const key = `${p.sign}-${p.houseIndex}`;
			if (!sectorMap.has(key)) sectorMap.set(key, []);
			sectorMap.get(key)!.push(p);
		}

		const result: Record<string, number> = {};
		for (const [_, group] of sectorMap) {
			group.sort((a, b) => a.angle - b.angle);
			let clusterCount = 0;
			let prev: number | null = null;
			for (let i = 0; i < group.length; i++) {
				const { name, angle, raw, houseIndex } = group[i];
				let bumped = angle;

				const cusp = houses[houseIndex];
				const nextCusp = houses[(houseIndex + 1) % 12];
				if (isNearCusp(raw, cusp)) bumped += 3;
				else if (isNearCusp(raw, nextCusp)) bumped -= 3;

				if (prev !== null && angle - prev < clusterSpacingThreshold) {
					clusterCount++;
				} else {
					clusterCount = 0;
				}
				bumped += clusterCount * labelOffsetStep;
				result[name] = ((bumped % 360) + 360) % 360;
				prev = angle;
			}
		}

		return result;
	});
</script>

<svg
	id="birth-chart"
	class="color-base-content"
	viewBox={`0 0 ${size} ${size}`}
	preserveAspectRatio="xMidYMid meet"
	style="width: 100%; height: auto; display: block;"
>
	<!-- Chart info -->
	<g id="chart-info" class="fill-current text-xs" transform={`translate(${center}, ${center})`}>
		<text text-anchor="middle" class="font-bold" dy="-40">{meta.name}</text>
		<text text-anchor="middle" dy="-24">{localizedDate}, {localizedWeekday}</text>
		<text text-anchor="middle" dy="-8">{meta.time} (GMT {usedTimezone.offset})</text>
		<text text-anchor="middle" dy="8">{meta.city}, {meta.country}</text>
		<text text-anchor="middle" dy="24"
			>{toDMS(usedCoordinates.latitude, true)} {toDMS(usedCoordinates.longitude, false)}</text
		>
		<text class="italic" text-anchor="middle" dy="40">Tropical</text>
		<text class="italic" text-anchor="middle" dy="56">Alcabitius</text>
	</g>

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
	{#each Object.entries(unifiedPlanetPositions) as [name, point]}
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
				{point.position.degrees.toString().padStart(2, '0')}°
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
				{signList[point.signNumber - 1].iconReplacement}
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
