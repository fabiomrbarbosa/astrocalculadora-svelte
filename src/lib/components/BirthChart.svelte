<script lang="ts">
	import { signs, planets, points, houseSystems } from '$lib/staticData';
	import type { UnifiedPlanetPosition } from '$lib/types';

	let {
		meta,
		planetPositions,
		partOfFortune,
		houses,
		ascendant,
		midheaven,
		descendant,
		imumcoeli,
		usedCoordinates,
		usedTimezone,
		dayNight,
		dayRuler,
		hourRuler
	} = $props();

	// Localized date
	const PT_WEEKDAYS = [
		'segunda-feira',
		'terça-feira',
		'quarta-feira',
		'quinta-feira',
		'sexta-feira',
		'sábado',
		'domingo'
	] as const;

	let localizedWeekday = $derived.by(() => PT_WEEKDAYS[meta.weekday]);
	let localizedDate = $derived.by(() => {
		const [Y, M, D] = meta.date.split('-');
		return `${D}/${M}/${Y}`;
	});

	// Quadrant vs whole sign
	const isWholeSigns = $derived(meta.houseSystem === 'W');

	// Unified points list
	const unifiedPlanetPositions: Record<string, UnifiedPlanetPosition | undefined> = $derived.by(
		() => ({
			...planetPositions,
			NorthNode: points.northNode && planetPositions?.NorthNode,
			SouthNode: points.southNode && planetPositions?.SouthNode,
			PartOfFortune: partOfFortune
				? {
						position: partOfFortune.position,
						signNumber: partOfFortune.signNumber,
						signName: partOfFortune.signName
					}
				: undefined,

			Ascendant: isWholeSigns ? ascendant : undefined,
			Midheaven: isWholeSigns ? midheaven : undefined,
			Descendant: isWholeSigns ? descendant : undefined,
			ImumCoeli: isWholeSigns ? imumcoeli : undefined
		})
	);

	const signList = Object.values(signs);
	const planetMap = Object.fromEntries(
		[
			...Object.values(planets).map((p) => ({ name: p.value, glyph: p.iconReplacement })),
			...Object.entries(points)
				.filter(([, pt]) => !!pt.iconReplacement)
				.map(([, pt]) => ({ name: pt.value, glyph: pt.iconReplacement }))
		].map((p) => [p.name, p.glyph])
	);

	// Geometry constants
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

	// Label sizing knobs
	const glyphFontSizePx = 24;
	const approxGlyphWidthPx = glyphFontSizePx * 0.92; // good average for icon fonts

	// Helpers
	const norm360 = (a: number) => ((a % 360) + 360) % 360;
	const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

	function midpointAngle(a: number, b: number): number {
		const diff = ((b - a + 360) % 360) / 2;
		return (a + diff) % 360;
	}

	function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
		const rad = (180 - angle) * (Math.PI / 180);
		return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
	}

	function toDMS(deg: number, isLat: boolean): string {
		const abs = Math.abs(deg);
		const degrees = Math.floor(abs);
		const minutes = Math.round((abs - degrees) * 60);
		const direction = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
		return `${degrees}°${direction}${minutes}'`;
	}

	function pxToDeg(px: number, r: number): number {
		if (r <= 0) return 0;
		return ((px / r) * 180) / Math.PI;
	}

	function findHouseIndex(longitude: number, cusps: number[]): number {
		if (!Array.isArray(cusps) || cusps.length !== 12) return 0;
		const raw = norm360(longitude);
		for (let i = 0; i < 12; i++) {
			const h0 = norm360(cusps[i]);
			const h1 = norm360(cusps[(i + 1) % 12]);
			if (h0 <= h1) {
				if (raw >= h0 && raw < h1) return i;
			} else {
				if (raw >= h0 || raw < h1) return i;
			}
		}
		return 0;
	}

	// Spacing solver that avoids "end cusp pile-up" by shifting the entire pack
	function solvePacked(
		items: Array<{ name: string; t: number }>,
		L: number,
		R: number,
		minSep: number
	): Record<string, number> {
		const out: Record<string, number> = {};
		if (items.length === 0) return out;

		const sorted = [...items].sort((a, b) => a.t - b.t);
		const x = sorted.map((it) => clamp(it.t, L, R));

		for (let i = 1; i < x.length; i++) x[i] = Math.max(x[i], x[i - 1] + minSep);

		const overflow = x[x.length - 1] - R;
		if (overflow > 0) for (let i = 0; i < x.length; i++) x[i] -= overflow;

		for (let i = x.length - 2; i >= 0; i--) x[i] = Math.min(x[i], x[i + 1] - minSep);

		const underflow = L - x[0];
		if (underflow > 0) for (let i = 0; i < x.length; i++) x[i] += underflow;

		for (let i = 1; i < x.length; i++) x[i] = Math.max(x[i], x[i - 1] + minSep);

		for (let i = 0; i < sorted.length; i++) out[sorted[i].name] = x[i];
		return out;
	}

	// Base rotation: Asc at 0°
	let rotationOffset: number = $derived(
		ascendant?.position?.longitude != null ? norm360(0 - ascendant.position.longitude) : 0
	);

	// Zodiac markers + degree ticks + house cusp labels
	const zodiacMarkers = $derived(
		Object.entries(signs).map(([, sign], i: number) => {
			const start = norm360(i * 30 + rotationOffset);
			return { start, mid: norm360(start + 15), glyph: sign.iconReplacement, name: sign.value };
		})
	);

	const degreeTicks = $derived(
		zodiacMarkers.flatMap(({ start }) =>
			Array.from({ length: 30 }, (_, i) => {
				const absoluteDegree = norm360(start + i);
				return {
					angle: absoluteDegree,
					startRadius: zodiacInner,
					endRadius: zodiacInner + (i % 10 === 0 ? 10 : 5)
				};
			})
		)
	);

	const houseCuspLabels = $derived.by(() => {
		if (!houses) return [];
		return houses.map((cusp: number, i: number) => {
			const angle = norm360(cusp + rotationOffset);
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

	// Label angles:
	// - keep ticks true
	// - compute label angles in an unwrapped monotonic frame to avoid 0°/360° seam bugs
	// - merge consecutive houses into a sector when a house is too narrow
	const adjustedPlanetAngles: Record<string, number> = $derived.by(() => {
		if (!houses || houses.length !== 12) return {};

		const labelRadius = planetRingOuter - 20;
		const minSepDegBase = pxToDeg(approxGlyphWidthPx, labelRadius);
		const cuspBufferDeg = pxToDeg(approxGlyphWidthPx / 2 + 2, labelRadius);

		// Build a monotonic cusp array in rotated space: cusps[0..12] increasing
		const cusp0 = norm360(houses[0] + rotationOffset);
		const C: number[] = [cusp0];
		for (let i = 1; i < 12; i++) {
			let a = norm360(houses[i] + rotationOffset);
			while (a <= C[i - 1]) a += 360;
			C[i] = a;
		}
		C[12] = C[0] + 360;

		// Collect items in both wrapped (for display ticks) and unwrapped (for spacing) frames
		const byHouse = Array.from({ length: 12 }, () => [] as Array<{ name: string; t: number }>);
		for (const [name, pt] of Object.entries(unifiedPlanetPositions)) {
			if (!pt?.position) continue;

			const raw = norm360(pt.position.longitude);
			const houseIndex = findHouseIndex(raw, houses);

			let t = norm360(raw + rotationOffset);
			// unwrap into the [C0, C0+360) frame
			if (t < C[0]) t += 360;

			byHouse[houseIndex].push({ name, t });
		}

		// Merge houses into sectors until the sector can fit the members at minSep.
		const placedU: Record<string, number> = {};

		let h = 0;
		while (h < 12) {
			let sh = h;
			let eh = h;

			let members: Array<{ name: string; t: number }> = [];
			const rebuild = () => {
				members = [];
				for (let k = sh; k <= eh; k++) members.push(...byHouse[k]);
				members.sort((a, b) => a.t - b.t);
			};

			const fits = (minSep: number) => {
				const L = C[sh] + cuspBufferDeg;
				const R = C[eh + 1] - cuspBufferDeg;
				if (members.length <= 1) return true;
				const available = R - L;
				const needed = (members.length - 1) * minSep;
				return available > 0 && needed <= available;
			};

			rebuild();
			while (!fits(minSepDegBase) && eh < 11) {
				eh++;
				rebuild();
			}

			const L = C[sh] + cuspBufferDeg;
			const R = C[eh + 1] - cuspBufferDeg;

			// Always solve something; if even after merging it can't fit, relax minSep *within this sector*.
			let minSep = minSepDegBase;
			if (members.length > 1) {
				const available = R - L;
				const maxMinSep = available / (members.length - 1);
				if (maxMinSep < minSep) minSep = Math.max(0.75, maxMinSep); // keep a small separation
			}

			const solved = R > L ? solvePacked(members, L, R, minSep) : {};
			for (const m of members) placedU[m.name] = solved[m.name] ?? m.t;

			h = eh + 1;
		}

		// Normalize back to 0..360 for SVG polar conversion
		const out: Record<string, number> = {};
		for (const [name, t] of Object.entries(placedU)) out[name] = norm360(t);
		return out;
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
		<text text-anchor="middle" dy="-24"
			>{localizedDate}{meta.calendar == 'JUL' ? ' OS' : ''}, {localizedWeekday}</text
		>
		<text text-anchor="middle" dy="-8">{meta.time} ({usedTimezone.offset})</text>
		<text text-anchor="middle" dy="8">{meta.city}, {meta.country}</text>
		<text text-anchor="middle" dy="24"
			>{toDMS(usedCoordinates.latitude, true)} {toDMS(usedCoordinates.longitude, false)}</text
		>
		<text class="italic" text-anchor="middle" dy="40">Tropical</text>
		<text class="italic" text-anchor="middle" dy="56">{houseSystems[meta.houseSystem].name}</text>
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

	<!-- Sign dividers -->
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

	<!-- Sign glyphs -->
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
			stroke-width={isWholeSigns ? 0.5 : i % 3 === 0 ? 2.5 : 0.5}
		/>
	{/each}

	<!-- Planet points & labels -->
	{#each Object.entries(unifiedPlanetPositions) as [name, point]}
		{#if point?.position}
			{@const p = point as UnifiedPlanetPosition}
			{@const angle = (p.position.longitude + rotationOffset) % 360}
			{@const labelAngle = adjustedPlanetAngles[name] ?? angle}

			<!-- Outer tick -->
			{@const o1 = polarToCartesian(center, center, planetRingOuter, angle)}
			{@const o2 = polarToCartesian(center, center, planetRingOuter - 6, angle)}
			<line x1={o1.x} y1={o1.y} x2={o2.x} y2={o2.y} class="stroke-current" stroke-width="0.5" />

			<!-- Inner tick -->
			{@const i1 = polarToCartesian(center, center, houseNumberRadius, angle)}
			{@const i2 = polarToCartesian(center, center, houseNumberRadius + 6, angle)}
			<line x1={i1.x} y1={i1.y} x2={i2.x} y2={i2.y} class="stroke-current" stroke-width="0.5" />

			<!-- Labels at adjusted angle (no tiering) -->
			{@const glyphRadius = planetRingOuter - 20}
			{@const radialStep = 16}

			{@const gp = polarToCartesian(center, center, glyphRadius, labelAngle)}
			{@const dp = polarToCartesian(center, center, glyphRadius - radialStep * 1.35, labelAngle)}
			{@const sp = polarToCartesian(center, center, glyphRadius - radialStep * 2.45, labelAngle)}
			{@const mp = polarToCartesian(center, center, glyphRadius - radialStep * 3.5, labelAngle)}
			{@const rp = polarToCartesian(center, center, glyphRadius - radialStep * 4.5, labelAngle)}

			<text
				class="font-astronomicon fill-current birth-chart__{name.toLowerCase()}"
				x={gp.x}
				y={gp.y}
				font-size={glyphFontSizePx}
				text-anchor="middle"
				dominant-baseline="central"
			>
				{planetMap[name] ?? name}
			</text>

			<text
				class="fill-current"
				x={dp.x}
				y={dp.y}
				font-size="12"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{p.position.degrees.toString().padStart(2, '0')}°
			</text>

			<text
				class="font-astronomicon fill-current"
				x={sp.x}
				y={sp.y}
				font-size="16"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{signList[('signNumber' in p ? p.signNumber : 1) - 1].iconReplacement}
			</text>

			<text
				class="fill-current"
				x={mp.x}
				y={mp.y}
				font-size="10"
				text-anchor="middle"
				dominant-baseline="central"
			>
				{p.position.minutes.toString().padStart(2, '0')}'
			</text>

			{#if p.retrograde}
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
