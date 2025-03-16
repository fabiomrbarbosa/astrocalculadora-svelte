import { chartData } from './store.svelte';
import { calculatePosition, convertPositionToSignAndDegrees } from './utils';

/** Calculate Part of Fortune */
export function calculatePartFortune(): void {
	const sunPos = calculatePosition(
		chartData.planets.sun.sign,
		chartData.planets.sun.degrees,
		chartData.planets.sun.minutes
	);
	const moonPos = calculatePosition(
		chartData.planets.moon.sign,
		chartData.planets.moon.degrees,
		chartData.planets.moon.minutes
	);
	const ascPos = calculatePosition(
		chartData.points.ascendant.sign,
		chartData.points.ascendant.degrees,
		chartData.points.ascendant.minutes
	);

	let fortunePos =
		chartData.dayNight === 'day' ? ascPos + (moonPos - sunPos) : ascPos + (sunPos - moonPos);

	// Convert result into structured object
	const fortuneData = convertPositionToSignAndDegrees(fortunePos);

	// Store structured data in parts.fortune
	chartData.points.partFortune = {
		...chartData.points.partFortune,
		degrees: fortuneData.degrees,
		minutes: fortuneData.minutes,
		sign: fortuneData.sign,
		dispositor: chartData.signs[fortuneData.sign]?.dignities.domicile || ''
	};

	// Store formatted result in results.fortune
	chartData.results.partFortune = `Parte da Fortuna: ${fortuneData.degrees}°${fortuneData.minutes}' em ${fortuneData.icon} ${fortuneData.label}`;
}

export function calculatePartSubstance(): void {
	const ruler2 = chartData.planets[chartData.houses.house2.ruler];
	const ruler2Pos = calculatePosition(ruler2.sign, ruler2.degrees, ruler2.minutes);
	const cusp2Pos = calculatePosition(
		chartData.houses.house2.cusp.sign,
		chartData.houses.house2.cusp.degrees,
		chartData.houses.house2.cusp.minutes
	);
	const ascPos = calculatePosition(
		chartData.points.ascendant.sign,
		chartData.points.ascendant.degrees,
		chartData.points.ascendant.minutes
	);

	// Convert result into structured object
	const substanceData = convertPositionToSignAndDegrees(ascPos + (cusp2Pos - ruler2Pos));

	// Store structured data in parts.substance
	chartData.points.partSubstance = {
		...chartData.points.partSubstance,
		degrees: substanceData.degrees,
		minutes: substanceData.minutes,
		sign: substanceData.sign,
		dispositor: chartData.signs[substanceData.sign]?.dignities.domicile || ''
	};

	// Store formatted result in results.substance
	chartData.results.partSubstance = `Parte da Substância: ${substanceData.degrees}°${substanceData.minutes}' em ${substanceData.icon} ${substanceData.label}`;
}

export function calculatePartMarriage(): void {
	const venusPos = calculatePosition(
		chartData.planets.venus.sign,
		chartData.planets.venus.degrees,
		chartData.planets.venus.minutes
	);
	const saturnPos = calculatePosition(
		chartData.planets.saturn.sign,
		chartData.planets.saturn.degrees,
		chartData.planets.saturn.minutes
	);
	const ascPos = calculatePosition(
		chartData.points.ascendant.sign,
		chartData.points.ascendant.degrees,
		chartData.points.ascendant.minutes
	);

	let marriagePos =
		chartData.maleFemale === 'male'
			? ascPos + (venusPos - saturnPos)
			: ascPos + (saturnPos - venusPos);

	// Convert result into structured object
	const marriageData = convertPositionToSignAndDegrees(marriagePos);

	// Store formatted result in results.marriage
	chartData.results.partMarriage = `Parte do Casamento: ${marriageData.degrees}°${marriageData.minutes}' em ${marriageData.icon} ${marriageData.label}`;
}
