import { chartData } from '$lib/chartData.svelte';
import { signs } from './staticData';

type PlanetPosition = {
	position: {
		degrees: number;
		minutes: number;
	};
	signName: string;
	retrograde: boolean;
};

type Ascendant = {
	position: {
		degrees: number;
		minutes: number;
	};
	signName: string;
};

type UsedCoordinates = {
	latitude: number;
	longitude: number;
	city?: string;
	country?: string;
};

type UsedTimezone = {
	name?: string;
	offset?: string;
};

type MetaData = {
	year?: number | string;
	month?: number | string;
	day?: number | string;
	hour?: number | string;
	minute?: number | string;
	second?: number | string;
	utcTime?: string;
};

type SyncChartInput = {
	planetPositions: Record<string, PlanetPosition>;
	ascendant: Ascendant;
	houses: number[];
	meta?: MetaData;
	usedCoordinates?: UsedCoordinates;
	usedTimezone?: UsedTimezone;
};

function findSignKey(signName: string): keyof typeof signs {
	const normalized = signName.trim().toLowerCase();
	return (normalized in signs ? normalized : 'aries') as keyof typeof signs;
}

export function syncChartToData({
	planetPositions,
	ascendant,
	houses,
	meta,
	usedCoordinates,
	usedTimezone
}: SyncChartInput): void {
	// If backend adjusts UTC time or timezone info, optionally keep just these:
	chartData.meta.utcTime = meta?.utcTime || '';
	chartData.meta.utcOffset = usedTimezone?.offset || '+00:00';
	chartData.meta.timezone = usedTimezone?.name || 'UTC';

	for (const [planetKey, data] of Object.entries(planetPositions)) {
		const key = planetKey.toLowerCase();
		if (chartData.planets[key]) {
			chartData.planets[key].degrees = data.position.degrees;
			chartData.planets[key].minutes = data.position.minutes;
			chartData.planets[key].sign = findSignKey(data.signName);
			chartData.planets[key].retrograde = data.retrograde;
		}
	}

	chartData.points.ascendant.degrees = ascendant.position.degrees;
	chartData.points.ascendant.minutes = ascendant.position.minutes;
	chartData.points.ascendant.sign = findSignKey(ascendant.signName);

	const signKeys = Object.keys(signs) as Array<keyof typeof signs>;

	houses.forEach((cusp, i) => {
		// which zodiac sign the cusp sits in:
		const index = Math.floor(cusp / 30);
		const signKey = signKeys[index]; // e.g. 'gemini'
		const signObj = signs[signKey];

		const degrees = Math.floor(cusp % 30);
		const minutes = Math.floor(((cusp % 30) - degrees) * 60);
		const ruler = signObj.dignities.domicile; // <-- planetary ruler

		const houseKey = `house${i + 1}` as keyof typeof chartData.houses;
		chartData.houses[houseKey] = {
			cusp: {
				label: `Cúspide da ${i + 1}ª Casa`,
				degrees,
				minutes,
				sign: signKey, // 'gemini', 'cancer', etc.
				ruler // add the domicile ruler here
			}
		};
	});
}
