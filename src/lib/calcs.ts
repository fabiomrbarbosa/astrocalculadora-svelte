import { chartData } from './chartData.svelte';
import { aspects, signs, hylegicPoints, resourceSignifiers, planets } from './staticData';
import {
	calculatePosition,
	convertPositionToSignAndDegrees,
	getHouseScore,
	getSignifierValue,
	processDignities
} from './utils';

export function calculateAspects() {
	// Reset results
	chartData.results.aspects = [];
	chartData.results.aspectTable = {};

	const planetKeys = Object.keys(chartData.planets);
	const signKeys = Object.keys(signs);

	// Initialize aspect table with **columns as initiators**
	planetKeys.forEach((initiator) => {
		chartData.results.aspectTable[initiator] = {};
	});

	// Compare each planet with every other planet
	for (let i = 0; i < planetKeys.length; i++) {
		for (let j = i + 1; j < planetKeys.length; j++) {
			const fastPlanet = chartData.planets[planetKeys[i]];
			const slowPlanet = chartData.planets[planetKeys[j]];

			const fastMeta = planets[planetKeys[i]];
			const slowMeta = planets[planetKeys[j]];
			const fastLabel = fastMeta?.label || fastPlanet.label;
			const slowLabel = slowMeta?.label || slowPlanet.label;
			const orb = Math.max(fastMeta?.orb || fastPlanet.orb, slowMeta?.orb || slowPlanet.orb);

			const fastPos = calculatePosition(fastPlanet.sign, fastPlanet.degrees, fastPlanet.minutes);
			const slowPos = calculatePosition(slowPlanet.sign, slowPlanet.degrees, slowPlanet.minutes);

			// Calculate the absolute angular difference
			let angle = (slowPos - fastPos + 360) % 360;
			if (angle > 180) angle = 360 - angle;

			for (const aspect of Object.values(aspects)) {
				let orbDiff = Math.abs(angle - aspect.angle);

				if (orbDiff <= orb) {
					// Determine sign difference
					const fastSignIndex = signKeys.indexOf(fastPlanet.sign.toLowerCase());
					const slowSignIndex = signKeys.indexOf(slowPlanet.sign.toLowerCase());
					const signDiff = (slowSignIndex - fastSignIndex + 12) % 12;

					let outOfSign = !aspect.signsApart.includes(signDiff);

					// Determine whether the aspect is **applying or separating**
					let isApplying = 'Ap';
					const projectedFastDegrees =
						outOfSign && slowPlanet.degrees > fastPlanet.degrees
							? fastPlanet.degrees + 30
							: fastPlanet.degrees;

					const projectedSlowDegrees =
						outOfSign && fastPlanet.degrees > slowPlanet.degrees
							? slowPlanet.degrees + 30
							: slowPlanet.degrees;

					if (!fastPlanet.retrograde) {
						isApplying = projectedFastDegrees < projectedSlowDegrees ? 'Ap' : 'Sp';
					} else {
						isApplying = projectedFastDegrees > projectedSlowDegrees ? 'Ap' : 'Sp';
					}

					// Add the aspect to results
					chartData.results.aspects.push({
						planet1: fastLabel + (fastPlanet.retrograde ? ' ℞' : ''),
						planet2: slowLabel + (slowPlanet.retrograde ? ' ℞' : ''),
						aspect: aspect.name,
						icon: aspect.icon,
						orb: `${Math.floor(orbDiff)}°${Math.round((orbDiff - Math.floor(orbDiff)) * 60)}'`,
						applying: isApplying,
						outOfSign: outOfSign
					});

					// Store aspect in table
					chartData.results.aspectTable[planetKeys[j]][planetKeys[i]] =
						`${aspect.icon} ${Math.floor(orbDiff)}°${Math.round((orbDiff - Math.floor(orbDiff)) * 60)}' ${isApplying}${outOfSign ? 'D' : ''}`;
				}
			}
		}
	}

	// ——————————————————————————————————————————
	// Add aspects to ASC and MC (listed last)
	// ——————————————————————————————————————————
	const anglePoints = [
		{ key: 'ascendant', label: 'ASC', data: chartData.points.ascendant },
		{ key: 'midheaven', label: 'MC', data: chartData.points.midheaven }
	];

	for (const { label, data } of anglePoints) {
		const anglePos = calculatePosition(data.sign, data.degrees, data.minutes);

		for (const planetKey of planetKeys) {
			const planet = chartData.planets[planetKey];
			const meta = planets[planetKey];
			const planetLabel = meta?.label || planet.label;
			const orb = meta?.orb || planet.orb;
			const planetPos = calculatePosition(planet.sign, planet.degrees, planet.minutes);

			let angle = (anglePos - planetPos + 360) % 360;
			if (angle > 180) angle = 360 - angle;

			for (const aspect of Object.values(aspects)) {
				const orbDiff = Math.abs(angle - aspect.angle);

				if (orbDiff <= orb) {
					const signDiff =
						(signKeys.indexOf(data.sign.toLowerCase()) -
							signKeys.indexOf(planet.sign.toLowerCase()) +
							12) %
						12;
					const outOfSign = !aspect.signsApart.includes(signDiff);

					chartData.results.aspects.push({
						planet1: planetLabel + (planet.retrograde ? ' ℞' : ''),
						planet2: label,
						aspect: aspect.name,
						icon: aspect.icon,
						orb: `${Math.floor(orbDiff)}°${Math.round((orbDiff - Math.floor(orbDiff)) * 60)}'`,
						applying: '', // Not applicable
						outOfSign
					});
				}
			}
		}
	}
}

/* Calculate Almutem Figuris */
export function calculateAlmutemFiguris(): void {
	// 🎯 Initialize planetary scores
	let scores: Record<string, number> = {
		moon: 0,
		mercury: 0,
		venus: 0,
		sun: 0,
		mars: 0,
		jupiter: 0,
		saturn: 0
	};

	let scoreBreakdown: Record<string, string[]> = {
		moon: [],
		mercury: [],
		venus: [],
		sun: [],
		mars: [],
		jupiter: [],
		saturn: []
	};

	let houseScores = { ...scores };
	let dignitySubtotal = { ...scores };

	// 🎯 Step 1: Process Hylegic Points
	Object.entries(hylegicPoints).forEach(([key, { source }]) => {
		let pos = getSignifierValue(source);
		if (pos) {
			processDignities(pos, key, scores, scoreBreakdown);
		}
	});

	// 🎯 Step 2: Store Dignity Totals Before House Score Adjustment
	dignitySubtotal = { ...scores };

	// 🎯 Step 3: Assign House Strength Scores
	Object.entries(chartData.planets).forEach(([planetKey, planetData]) => {
		if (planetData.house) {
			const houseScore = getHouseScore(parseInt(planetData.house, 10));
			scores[planetKey] += houseScore;
			houseScores[planetKey] = houseScore;
			scoreBreakdown[planetKey].push(`Casa ${planetData.house} +${houseScore}`);
		}
	});

	// 🎯 Step 4: Bonus for Ruler of Day/Night
	if (chartData.rulerOfDay) {
		scores[chartData.rulerOfDay] += 7;
		scoreBreakdown[chartData.rulerOfDay].push(`Regente do Dia/da Noite +7`);
	}

	// 🎯 Step 5: Bonus for Ruler of Hour
	if (chartData.rulerOfHour) {
		scores[chartData.rulerOfHour] += 6;
		scoreBreakdown[chartData.rulerOfHour].push(`Regente da Hora +6`);
	}

	// 🎯 Store Final Results in Chart Data
	chartData.results.almutemFiguris = {
		scores,
		scoreBreakdown,
		dignitySubtotal,
		houseScores,
		rulerOfDay: chartData.rulerOfDay,
		rulerOfHour: chartData.rulerOfHour
	};
}

/* Calculate Almutem of Substance */
export function calculateAlmutemSubstance(): void {
	let scores: Record<string, number> = {
		moon: 0,
		mercury: 0,
		venus: 0,
		sun: 0,
		mars: 0,
		jupiter: 0,
		saturn: 0
	};

	let scoreBreakdown: Record<string, string[]> = {
		moon: [],
		mercury: [],
		venus: [],
		sun: [],
		mars: [],
		jupiter: [],
		saturn: []
	};

	// Iterate over the resourceSignifiers object
	Object.entries(resourceSignifiers).forEach(([key, { source }]) => {
		let pos = getSignifierValue(source);
		if (!pos) return;

		// 🎯 Handle dynamically derived dispositors using getters
		if (key === 'partFortuneDispositor') {
			pos = chartData.partFortuneDispositor;
		} else if (key === 'partSubstanceDispositor') {
			pos = chartData.partSubstanceDispositor;
		}

		// Convert string references to planet objects
		if (typeof pos === 'string' && chartData.planets[pos]) {
			pos = chartData.planets[pos];
		}

		// 🎯 Step 1: Process multiple planets in a house first
		if (Array.isArray(pos)) {
			pos.forEach((planetName) => {
				if (chartData.planets[planetName]) {
					processDignities(
						chartData.planets[planetName],
						`${planetName}_house2_planets`, // Labeling properly
						scores,
						scoreBreakdown
					);
				}
			});
			return; // Skip further processing for this case
		}

		// 🎯 Process the main point **without dispositors**
		processDignities(pos, key, scores, scoreBreakdown);
	});

	// 🎯 Store the final results properly
	chartData.results.almutemSubstance = {
		scores,
		scoreBreakdown
	};
}

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
		dispositor: signs[fortuneData.sign]?.dignities.domicile || ''
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
		dispositor: signs[substanceData.sign]?.dignities.domicile || ''
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

	// Store formatted result in results.partMarriage
	chartData.results.partMarriage = `Parte do Casamento: ${marriageData.degrees}°${marriageData.minutes}' em ${marriageData.icon} ${marriageData.label}`;
}

export function calculatePartChildren() {
	const jupiterPos = calculatePosition(
		chartData.planets.jupiter.sign,
		chartData.planets.jupiter.degrees,
		chartData.planets.jupiter.minutes
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

	let childrenPos =
		chartData.dayNight === 'day'
			? ascPos + (saturnPos - jupiterPos)
			: ascPos + (jupiterPos - saturnPos);

	// Convert result into structured object
	const childrenData = convertPositionToSignAndDegrees(childrenPos);

	// Store formatted result in results.children
	chartData.results.partChildren = `Parte dos Filhos: ${childrenData.degrees}°${childrenData.minutes}' em ${childrenData.icon} ${childrenData.label}`;
}

export function calculatePartFriends() {
	const moonPos = calculatePosition(
		chartData.planets.moon.sign,
		chartData.planets.moon.degrees,
		chartData.planets.moon.minutes
	);
	const mercuryPos = calculatePosition(
		chartData.planets.mercury.sign,
		chartData.planets.mercury.degrees,
		chartData.planets.mercury.minutes
	);
	const ascPos = calculatePosition(
		chartData.points.ascendant.sign,
		chartData.points.ascendant.degrees,
		chartData.points.ascendant.minutes
	);

	// Convert result into structured object
	const friendsData = convertPositionToSignAndDegrees(ascPos + (mercuryPos - moonPos));

	// Store formatted result in results.friends
	chartData.results.partFriends = `Parte dos Amigos: ${friendsData.degrees}°${friendsData.minutes}' em ${friendsData.icon} ${friendsData.label}`;
}

export function calculatePartEnemies() {
	const ruler12 = chartData.planets[chartData.houses.house12.ruler];
	const ruler12Pos = calculatePosition(ruler12.sign, ruler12.degrees, ruler12.minutes);
	const cusp12Pos = calculatePosition(
		chartData.houses.house12.cusp.sign,
		chartData.houses.house12.cusp.degrees,
		chartData.houses.house12.cusp.minutes
	);
	const ascPos = calculatePosition(
		chartData.points.ascendant.sign,
		chartData.points.ascendant.degrees,
		chartData.points.ascendant.minutes
	);

	// Convert result into structured object
	const enemiesData = convertPositionToSignAndDegrees(ascPos + (cusp12Pos - ruler12Pos));

	// Store formatted result in results.enemies
	chartData.results.partEnemies = `Parte dos Inimigos: ${enemiesData.degrees}°${enemiesData.minutes}' em ${enemiesData.icon} ${enemiesData.label}`;
}

export function calculatePartReligion() {
	const moonPos = calculatePosition(
		chartData.planets.moon.sign,
		chartData.planets.moon.degrees,
		chartData.planets.moon.minutes
	);
	const mercuryPos = calculatePosition(
		chartData.planets.mercury.sign,
		chartData.planets.mercury.degrees,
		chartData.planets.mercury.minutes
	);
	const ascPos = calculatePosition(
		chartData.points.ascendant.sign,
		chartData.points.ascendant.degrees,
		chartData.points.ascendant.minutes
	);

	let religionPos =
		chartData.dayNight === 'day'
			? ascPos + (mercuryPos - moonPos)
			: ascPos + (moonPos - mercuryPos);

	// Convert result into structured object
	const religionData = convertPositionToSignAndDegrees(religionPos);

	// Store formatted result in results.religion
	chartData.results.partReligion = `Parte da Lei ou da Religião: ${religionData.degrees}°${religionData.minutes}' em ${religionData.icon} ${religionData.label}`;
}

export function calculateAll() {
	calculatePartFortune();
	calculatePartSubstance();
	calculatePartMarriage();
	calculatePartChildren();
	calculatePartFriends();
	calculatePartEnemies();
	calculatePartReligion();
	// Calculating these depends on getting the above Parts right:
	calculateAspects();
	calculateAlmutemFiguris();
	calculateAlmutemSubstance();
}
