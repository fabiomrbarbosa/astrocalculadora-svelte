import { chartData } from '$lib/chartData.svelte'; // wherever it's defined
import { signs } from './staticData';

function findSignKey(signName: string): keyof typeof signs {
	return Object.keys(signs).find((k) => signs[k].label === signName.toLowerCase()) || 'aries';
}

export function syncEphemerisToChartData({ planetPositions, ascendant, houses }) {
	for (const [planetKey, data] of Object.entries(planetPositions)) {
		const key = planetKey.toLowerCase(); // ensure keys match lowercase ones in chartData
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

	// House cusp loop
	houses.forEach((cusp, i) => {
		const houseNum = i + 1;
		const signIndex = Math.floor(cusp / 30);
		const signName = signs[signIndex]?.label || 'aries';
		const degrees = Math.floor(cusp % 30);
		const minutes = Math.floor(((cusp % 30) - degrees) * 60);

		const houseKey = `house${houseNum}` as keyof typeof chartData.houses;
		if (!chartData.houses[houseKey]) {
			chartData.houses[houseKey] = {};
		}
		chartData.houses[houseKey].cusp = {
			label: `Cúspide da ${houseNum}ª Casa`,
			degrees,
			minutes,
			sign: findSignKey(signName)
		};
	});
}
