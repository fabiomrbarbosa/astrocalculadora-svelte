import { chartData } from './store.svelte';

export function checkSignParam() {
	const params = new URLSearchParams(window.location.search);

	// Ensure TypeScript knows these are indexable objects
	const planets = chartData.planets as Record<string, { sign: string }>;
	const points = chartData.points as Record<string, { sign: string }>;
	const signs = chartData.signs as Record<string, unknown>;

	// Iterate over all planets
	Object.keys(planets).forEach((planetKey) => {
		const param = params.get(`${planetKey}Sign`);
		if (param && signs[param]) {
			planets[planetKey].sign = param;
		}
	});

	// Iterate over all points
	Object.keys(points).forEach((pointKey) => {
		const param = params.get(`${pointKey}Sign`);
		if (param && signs[param]) {
			points[pointKey].sign = param;
		}
	});
}

/** Get the value of a nested property in chartData */
export function getSignifierValue(path: string): any {
	let value = path.split('.').reduce((obj: any, key: string) => obj?.[key], chartData) || null;

	// Fix: Explicitly define `chartData.planets` as a Record<string, PlanetType>
	if (
		typeof value === 'string' &&
		(chartData.planets as Record<string, typeof chartData.planets.moon>)[value]
	) {
		return (chartData.planets as Record<string, typeof chartData.planets.moon>)[value]; // Return planet object
	}

	return value;
}

/** Get sign data by sign key */
export function getSignData(
	sign: string
): { value: string; label: string; icon: string; degrees: number } | undefined {
	// Explicitly cast chartData.signs as a record with string keys
	return (
		chartData.signs as Record<
			string,
			{ value: string; label: string; icon: string; degrees: number }
		>
	)[sign.toLowerCase()];
}

/** Calculate absolute zodiac position (0-360°) */
export function calculatePosition(sign: string, degrees: number, minutes: number): number {
	const signData = getSignData(sign);
	if (!signData) throw new Error(`Invalid sign: ${sign}`);

	return signData.degrees + degrees + minutes / 60;
}

/** Convert absolute position back to sign, degrees, and minutes */
export function convertPositionToSignAndDegrees(position: number): {
	degrees: number;
	minutes: number;
	sign: string;
	icon: string;
	label: string;
} {
	if (position < 0) position += 360;
	else if (position >= 360) position -= 360;

	const [resultKey, resultSign] = Object.entries(chartData.signs).find(
		([_, s]) => position >= s.degrees && position < s.degrees + 30
	) || [null, null];

	if (!resultKey || !resultSign) throw new Error(`Invalid position: ${position}`);

	const resultDegrees = position - resultSign.degrees;
	const degrees = Math.floor(resultDegrees);
	const minutes = Math.round((resultDegrees - degrees) * 60);

	return {
		degrees,
		minutes,
		sign: resultKey,
		icon: resultSign.icon,
		label: resultSign.label
	};
}

/** Process dignities for a given planetary position */
export function processDignities(
	pos: { sign: string; degrees: number } | null,
	label: string,
	scores: Record<string, number>,
	scoreBreakdown: Record<string, string[]>
): void {
	if (!pos?.sign) return;

	const signDignity = chartData.signs[pos.sign.toLowerCase()].dignities;
	if (!signDignity) return; // Ensure dignity data exists

	const degree = pos.degrees;

	const addScore = (planet: string | null, score: number, dignityType: string) => {
		if (!planet || isNaN(score)) return;
		scores[planet] = (scores[planet] || 0) + score;
		scoreBreakdown[planet] = scoreBreakdown[planet] || [];
		scoreBreakdown[planet].push(`${label} +${score} (${dignityType})`);
	};

	// Domicile
	addScore(signDignity.domicile, 5, 'Domicílio');

	// Exaltation
	addScore(signDignity.exaltation, 4, 'Exaltação');

	// Triplicity
	signDignity.triplicities.forEach((triplicityRuler: string) => {
		addScore(triplicityRuler, 3, 'Triplicidade');
	});

	// Term
	const termRuler = Object.keys(signDignity.terms)
		.map(Number)
		.reverse()
		.find((d) => degree >= d);
	if (termRuler !== undefined) {
		addScore(signDignity.terms[termRuler], 2, 'Termo');
	}

	// Face
	const faceRuler = Object.keys(signDignity.faces)
		.map(Number)
		.reverse()
		.find((d) => degree >= d);
	if (faceRuler !== undefined) {
		addScore(signDignity.faces[faceRuler], 1, 'Face');
	}
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

/** Calculate Part of Fortune */
export function calculateFortune(): void {
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
	chartData.points.fortune.degrees = fortuneData.degrees;
	chartData.points.fortune.minutes = fortuneData.minutes;
	chartData.points.fortune.sign = fortuneData.sign;

	// Store formatted result in results.fortune
	chartData.results.fortune = `Parte da Fortuna: ${fortuneData.degrees}°${fortuneData.minutes}' em ${fortuneData.icon} ${fortuneData.label}`;
}
