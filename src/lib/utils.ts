import { chartData } from './chartData.svelte';
import { signs } from './staticData';

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
		.filter((b: string) => b.includes(keyPrefix))
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
