import { calculateAll } from './calcs';
import { chartData } from './chartData.svelte';
import { signs } from './staticData';
import type { SyncChartInput } from './types';

/** Type Definitions */
type PlanetKey = keyof typeof chartData.planets;
type SignKey = keyof typeof signs;

/** Get the value of a nested property in chartData */
export function getSignifierValue(path: string): any {
	const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], chartData) || null;

	// Ensure we return a planet object if the value is a string reference to a planet
	if (typeof value === 'string' && value in chartData.planets) {
		return chartData.planets[value as PlanetKey]; // Return planet object
	}

	return value;
}

/** Get sign data by sign key */
export function getSignData(sign: string) {
	const signKey = sign.toLowerCase() as SignKey;
	return signs[signKey];
}

/** Calculate absolute zodiac position (0-360°) */
export function calculatePosition(sign: string, degrees: number, minutes: number): number {
	const signData = getSignData(sign);
	if (!signData) throw new Error(`Invalid sign: ${sign}`);

	return signData.degrees + degrees + minutes / 60;
}

/** Convert absolute position back to sign, degrees, and minutes */
export function convertPositionToSignAndDegrees(position: number) {
	position = ((position % 360) + 360) % 360; // Normalize between 0-360

	const [signKey, signData] = Object.entries(signs).find(
		([_, s]) => position >= s.degrees && position < s.degrees + 30
	) as [SignKey, (typeof signs)[SignKey]];

	if (!signKey || !signData) throw new Error(`Invalid position: ${position}`);

	const resultDegrees = position - signData.degrees;
	const degrees = Math.floor(resultDegrees);
	const minutes = Math.round((resultDegrees - degrees) * 60);

	return {
		degrees,
		minutes,
		sign: signKey,
		icon: signData.icon,
		label: signData.label
	};
}

/** Process dignities for a given planetary position */
export function processDignities(
	pos: { sign: string; degrees: number } | null,
	label: string,
	scores: Record<PlanetKey, number>,
	scoreBreakdown: Record<PlanetKey, string[]>
): void {
	if (!pos?.sign) return;

	const signKey = pos.sign.toLowerCase() as SignKey;
	const signDignity = signs[signKey]?.dignities;
	if (!signDignity) return;

	const degree = pos.degrees;

	const addScore = (planet: string | null, score: number) => {
		if (!planet || isNaN(score)) return;
		const planetKey = planet as PlanetKey;
		scores[planetKey] = (scores[planetKey] || 0) + score;
		scoreBreakdown[planetKey] = scoreBreakdown[planetKey] || [];
		scoreBreakdown[planetKey].push(`${label} +${score}`);
	};

	// Assign Dignities (without labels)
	addScore(signDignity.domicile, 5);
	addScore(signDignity.exaltation, 4);

	// Triplicity
	signDignity.triplicities.forEach((triplicityRuler) => {
		addScore(triplicityRuler, 3);
	});

	// Term
	const termRuler = Object.keys(signDignity.terms)
		.map(Number)
		.reverse()
		.find((d) => degree >= d);
	if (termRuler !== undefined) {
		addScore(signDignity.terms[termRuler], 2);
	}

	// Face
	const faceRuler = Object.keys(signDignity.faces)
		.map(Number)
		.reverse()
		.find((d) => degree >= d);
	if (faceRuler !== undefined) {
		addScore(signDignity.faces[faceRuler], 1);
	}
}

export function getBreakdownScores(
	planetKey: string,
	keyPrefix: string,
	type: 'almutemFiguris' | 'almutemSubstance'
): string {
	const breakdown = chartData.results?.[type]?.scoreBreakdown?.[planetKey];

	if (!breakdown) return '';

	return breakdown
		.filter((b: string) => b.includes(keyPrefix + ' '))
		.map((b: string) => b.match(/\+\d+/g)?.join(' ') ?? '') // Ensure match is handled safely
		.join(' ');
}

/** Get a house strength score based on traditional rulership */
export function getHouseScore(house: number): number {
	const houseScores: Record<number, number> = {
		1: 12,
		10: 11,
		7: 10,
		4: 9,
		11: 8,
		5: 7,
		2: 6,
		9: 5,
		8: 4,
		3: 3,
		12: 2,
		6: 1
	};
	return houseScores[house] || 0;
}

function findSignKey(signName: string): keyof typeof signs {
	const norm = signName.trim().toLowerCase();
	return (norm in signs ? norm : 'aries') as keyof typeof signs;
}

/**
 * Fetches the full ephemeris (including prenatal syzygy) and syncs into chartData
 */
export async function loadEphemeris(
	name: string,
	date: string,
	time: string,
	city: string,
	country: string
) {
	// 1) fetch the combined birth-chart + syzygy
	const res = await fetch('/api/ephemeris', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name,
			date,
			time,
			city,
			country
		})
	});
	if (!res.ok) throw new Error(await res.text());
	const eph = await res.json();

	// 2) sync the main chart into your store
	syncEphToChartData(eph);

	// 3) final recalculation (includes syzygy in aspects, tables, etc.)
	calculateAll();
}

/**
 * After fetching data, sync it with state
 */

export function syncEphToChartData(input: SyncChartInput) {
	const {
		meta,
		planetPositions,
		ascendant,
		midheaven,
		houses,
		dayNight,
		dayRuler,
		hourRuler,
		usedCoordinates,
		usedTimezone,
		prenatalSyzygy
	} = input;

	// ——————————————————————————————
	// 1) Meta
	// ——————————————————————————————
	chartData.meta.name = meta.name || '';

	chartData.meta.city = meta.city || '';
	chartData.meta.country = meta.country || '';

	chartData.meta.utcTime = meta.utcTime || '';
	chartData.meta.utcOffset = usedTimezone?.offset || '+00:00';
	chartData.meta.timezone = usedTimezone?.name || 'UTC';

	chartData.dayNight = dayNight || '';
	chartData.rulerOfDay = dayRuler || '';
	chartData.rulerOfHour = hourRuler || '';

	// ——————————————————————————————
	// 2) Sync raw planet positions (skip nodes)
	// ——————————————————————————————
	for (const [pk, d] of Object.entries(planetPositions)) {
		const key = pk.toLowerCase();
		if (key === 'northnode' || key === 'southnode') continue;
		if (!chartData.planets[key]) continue;

		// compute full longitude
		const signKey = findSignKey(d.signName);
		const baseDeg = signs[signKey].degrees; // 0,30,60,…,330
		chartData.planets[key].degrees = d.position.degrees;
		chartData.planets[key].minutes = d.position.minutes;
		chartData.planets[key].sign = signKey;
		chartData.planets[key].retrograde = d.retrograde;
		// also store full house‐calc longitude on the planet if you want:
		chartData.planets[key].houseLongitude = baseDeg + d.position.degrees + d.position.minutes / 60;
	}

	// ——————————————————————————————
	// 3) Sync Ascendant
	// ——————————————————————————————
	chartData.points.ascendant ??= {};
	chartData.points.ascendant.degrees = ascendant.position.degrees;
	chartData.points.ascendant.minutes = ascendant.position.minutes;
	chartData.points.ascendant.sign = findSignKey(ascendant.signName);

	// ——————————————————————————————
	// 3) Sync Midheaven
	// ——————————————————————————————
	chartData.points.midheaven ??= {};
	chartData.points.midheaven.degrees = midheaven.position.degrees;
	chartData.points.midheaven.minutes = midheaven.position.minutes;
	chartData.points.midheaven.sign = findSignKey(midheaven.signName);

	// ——————————————————————————————
	// 4) Initialize each house
	// ——————————————————————————————
	const signKeys = Object.keys(signs) as Array<keyof typeof signs>;

	for (let i = 0; i < 12; i++) {
		const cusp = (houses[i] + 360) % 360;
		const houseNum = i + 1;
		const signIndex = Math.floor(cusp / 30);
		const signKey = signKeys[signIndex];
		const signObj = signs[signKey];
		const deg = Math.floor(cusp % 30);
		const min = Math.floor(((cusp % 30) - deg) * 60);

		chartData.houses[`house${houseNum}`] = {
			cusp: {
				degrees: deg,
				minutes: min,
				sign: signKey
			},
			ruler: signObj.dignities.domicile,
			planets: []
		};
	}

	// ————————————————————————
	// 5) Assign planets to houses
	// ————————————————————————
	const ORB = 5; // degrees before cusp that jump to next house

	for (const [rawKey, d] of Object.entries(planetPositions)) {
		const key = rawKey.toLowerCase();
		if (key === 'northnode' || key === 'southnode') continue;

		// **use the API’s full longitude**
		const lon = ((d.position.longitude % 360) + 360) % 360;

		// find the house‑index by comparing against each cusp interval
		let hi = houses.findIndex((cusp, i) => {
			const next = houses[(i + 1) % 12];
			if (cusp < next) {
				return lon >= cusp && lon < next;
			} else {
				// wrap‐around from 360→0
				return lon >= cusp || lon < next;
			}
		});
		if (hi < 0) hi = 0;

		// bump into the next house if within ORB of the next cusp
		const nextCusp = houses[(hi + 1) % 12];
		const distToNext = (nextCusp - lon + 360) % 360;
		if (distToNext < ORB) {
			hi = (hi + 1) % 12;
		}

		// store the house number on the planet
		chartData.planets[key].house = hi + 1;

		// finally, push the planet into house (hi+1)
		chartData.houses[`house${hi + 1}`].planets.push(key);
	}

	// ————————————————————————————
	// 6) Syzygy point (if present)
	// ————————————————————————————
	if (prenatalSyzygy) {
		chartData.points.syzygy = {
			label: 'Sizígia Pré-Natal',
			type: prenatalSyzygy.type,
			degrees: prenatalSyzygy.degrees,
			minutes: prenatalSyzygy.minutes,
			sign: prenatalSyzygy.sign
		};
	}

	// ————————————————————————————
	// 7) Save raw ephemeris result
	// ————————————————————————————

	chartData.rawEphemeris = {
		planetPositions,
		ascendant,
		midheaven,
		houses,
		dayNight: dayNight!,
		dayRuler: dayRuler!,
		hourRuler: hourRuler!,
		usedCoordinates: usedCoordinates!,
		usedTimezone: usedTimezone!
	};
}
