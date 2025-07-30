import { chartData } from '$lib/chartData.svelte';
import { calculateAll } from './calcs';
import { signs } from './staticData';

type PlanetPosition = {
	position: { degrees: number; minutes: number; longitude: number };
	signName: string;
	retrograde: boolean;
	longitude: number;
};

type Ascendant = {
	position: { degrees: number; minutes: number };
	signName: string;
};

type SyncChartInput = {
	planetPositions: Record<string, PlanetPosition>;
	ascendant: Ascendant;
	houses: number[]; // 12 cusp longitudes in absolute degrees [0–360)
	meta?: Record<string, any>;
	dayNight?: 'day' | 'night';
	dayRuler?: string;
	hourRuler?: string;
	usedCoordinates?: Record<string, any>;
	usedTimezone?: Record<string, any>;
};

function findSignKey(signName: string): keyof typeof signs {
	const norm = signName.trim().toLowerCase();
	return (norm in signs ? norm : 'aries') as keyof typeof signs;
}

export function syncChartToData(input: SyncChartInput) {
	const {
		planetPositions,
		ascendant,
		houses,
		dayNight,
		dayRuler,
		hourRuler,
		usedCoordinates,
		usedTimezone,
		meta
	} = input;

	// ——————————————————————————————
	// 1) Meta / timezone
	// ——————————————————————————————
	chartData.meta.utcTime = meta?.utcTime || '';
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
	chartData.points.ascendant.degrees = ascendant.position.degrees;
	chartData.points.ascendant.minutes = ascendant.position.minutes;
	chartData.points.ascendant.sign = findSignKey(ascendant.signName);

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
				label: `Cúspide da ${houseNum}ª Casa`,
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
	// 6) Save raw ephemeris result
	// ————————————————————————————

	chartData.rawEphemeris = {
		planetPositions,
		ascendant,
		houses,
		dayNight: dayNight!,
		dayRuler: dayRuler!,
		hourRuler: hourRuler!,
		usedCoordinates: usedCoordinates!,
		usedTimezone: usedTimezone!
	};

	// ——————————————————————
	// 7) Re‐run every calculation
	// ——————————————————————
	calculateAll();
}
