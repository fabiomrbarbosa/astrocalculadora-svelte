import path from 'path';
import sweph from 'sweph';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import SunCalc from 'suncalc';
import { json, error } from '@sveltejs/kit';
import opencage from 'opencage-api-client';
import geoTz from 'geo-tz';
import { env } from '$env/dynamic/private';

// Initialize Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set Swiss Ephemeris data path
// Use import.meta.url to locate this file, then point at the vendor folder
const ephePath = path.join(process.cwd(), 'src', 'lib', 'vendor', 'ephemeris');
sweph.set_ephe_path(ephePath);

// Planet & sign constants
const PLANETS = {
	Sun: sweph.constants.SE_SUN,
	Moon: sweph.constants.SE_MOON,
	Mercury: sweph.constants.SE_MERCURY,
	Venus: sweph.constants.SE_VENUS,
	Mars: sweph.constants.SE_MARS,
	Jupiter: sweph.constants.SE_JUPITER,
	Saturn: sweph.constants.SE_SATURN,
	NorthNode: sweph.constants.SE_TRUE_NODE,
	SouthNode: sweph.constants.SE_TRUE_NODE
};
const SIGNS = [
	'aries',
	'taurus',
	'gemini',
	'cancer',
	'leo',
	'virgo',
	'libra',
	'scorpio',
	'sagittarius',
	'capricorn',
	'aquarius',
	'pisces'
];

// Utility: Zodiac info
function getZodiacInfo(deg: number) {
	const normalized = ((deg % 360) + 360) % 360;
	const idx = Math.floor(normalized / 30);
	return { signNumber: idx + 1, signName: SIGNS[idx] };
}

// Utility: DMS from degrees
function degreesToDms(value: number) {
	const { degree, minute, second } = sweph.split_deg(value, sweph.constants.SE_SPLIT_DEG_ZODIACAL);
	return { degrees: degree, minutes: minute, seconds: second, longitude: value };
}

// Utility: Opposite longitude
function getOppositeLongitude(deg: number) {
	return (deg + 180) % 360;
}

// Direct ephemeris computation at given jdUT
function computeEphAtJd(jdUT: number, lat: number, lng: number) {
	const flags = sweph.constants.SEFLG_TROPICAL | sweph.constants.SEFLG_SPEED;
	const planetPositions: Record<string, any> = {};

	for (const [name, code] of Object.entries(PLANETS)) {
		const result = sweph.calc_ut(jdUT, code, flags);
		if (result.error) continue;
		let lon = result.data[0];
		let speed = result.data[3];
		if (name === 'SouthNode') {
			lon = getOppositeLongitude(lon);
			speed = -speed;
		}
		planetPositions[name] = {
			position: degreesToDms(lon),
			retrograde: speed < 0,
			...getZodiacInfo(lon)
		};
	}

	const housesData = sweph.houses_ex2(jdUT, flags, lat, lng, 'B');
	const ascLon = housesData.data.points[0];
	const asc = degreesToDms(ascLon);
	const ascInfo = getZodiacInfo(ascLon);

	return {
		planetPositions,
		ascendant: { position: asc, ...ascInfo },
		houses: housesData.data.houses
	};
}

// ── Sunrise/Sunset helpers ─────────────────────────
function getSunriseSunsetLocal(isoDate: string, lat: number, lng: number, tz: string) {
	// 1) Make a Date at local‐noon in the target tz
	const noon = dayjs.tz(`${isoDate}T12:00:00`, tz).toDate();
	// 2) Ask SunCalc…
	const times = SunCalc.getTimes(noon, lat, lng);

	// 5) Wrap back into Day.js in your tz
	return {
		sunrise: dayjs.tz(times.sunrise, tz),
		sunset: dayjs.tz(times.sunset, tz)
	};
}

// ── Planetary Hour helper ───────────────────────────────────────────────────
const CHALDEAN = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];

/**
 * Returns planetary hour number (1–24), hour ruler, and day ruler
 */
function getPlanetaryHour(
	localTime: dayjs.Dayjs,
	sunrise: dayjs.Dayjs,
	sunset: dayjs.Dayjs,
	nextRise: dayjs.Dayjs
) {
	let isDay: boolean;
	let segmentMs: number;
	let sinceMs: number;
	let cycleDay: number;

	if (localTime.isAfter(sunrise) && localTime.isBefore(sunset)) {
		isDay = true;
		segmentMs = sunset.diff(sunrise) / 12;
		sinceMs = localTime.diff(sunrise);
		cycleDay = localTime.day(); // 0=Sunday … 6=Saturday
	} else {
		isDay = false;
		if (localTime.isBefore(sunrise)) {
			const prevSet = sunset.subtract(1, 'day');
			segmentMs = sunrise.diff(prevSet) / 12;
			sinceMs = localTime.diff(prevSet);
			cycleDay = sunrise.subtract(1, 'day').day();
		} else {
			segmentMs = nextRise.diff(sunset) / 12;
			sinceMs = localTime.diff(sunset);
			cycleDay = localTime.day();
		}
	}

	const idx = Math.floor(sinceMs / segmentMs); // 0–11
	const hourNumber = isDay ? idx + 1 : idx + 13; // 1–24

	// 1) Compute the *original* day-ruler (Sun on Sunday, Moon on Monday, etc.)
	//    by jumping 3 steps per weekday from Saturday (index 0).
	const originalBaseIdx = ((cycleDay + 1) * 3) % CHALDEAN.length;
	const originalDayRuler = CHALDEAN[originalBaseIdx];

	// 2) For the “dayRuler” output, shift 2 steps back only if it's night
	const dayRuler = isDay
		? originalDayRuler
		: CHALDEAN[(originalBaseIdx - 2 + CHALDEAN.length) % CHALDEAN.length];

	// 3) But the hour-ruler always steps forward from the *original* day-ruler
	const hourRuler = CHALDEAN[(originalBaseIdx + (hourNumber - 1)) % CHALDEAN.length];

	return { hourNumber, hourRuler, dayRuler };
}

// ---------------
// SYZYGY HELPERS
// ---------------

// Meeus-based syzygy calculation
// Calculate lunation index K (Meeus ch.49)
function calcK(jd: number): number {
	// approximate UTC date from JD
	const dt = dayjs.utc((jd - 2440587.5) * 86400 * 1000);
	const Y = dt.year();
	const jdStartRes = sweph.utc_to_jd(Y, 1, 1, 0, 0, 0, sweph.constants.SE_GREG_CAL);
	const jdStart = jdStartRes.data[1];
	const daysInYear = jd - jdStart;
	const yFrac = Y + daysInYear / 365.25;
	return (yFrac - 1900) * 12.3685;
}

// Compute syzygy Julian Day for New (integer K) or Full (half-integer K)
function calcSyzygyJD(K: number): number {
	const T = K / 1236.85;
	// Mean anomalies
	const M = 359.2242 + 29.10535608 * K - 0.0000333 * Math.pow(T, 2) - 0.00000347 * Math.pow(T, 3);
	const M1 = 306.0253 + 385.81691806 * K + 0.0107306 * Math.pow(T, 2) + 0.00001236 * Math.pow(T, 3);
	const F = 21.2964 + 390.67050646 * K - 0.0016528 * Math.pow(T, 2) - 0.00000239 * Math.pow(T, 3);
	// Periodic corrections
	let corr = (0.1734 - 0.000393 * T) * Math.sin((M * Math.PI) / 180);
	corr += 0.0021 * Math.sin((2 * M * Math.PI) / 180);
	corr -= 0.4068 * Math.sin((M1 * Math.PI) / 180);
	corr += 0.0161 * Math.sin((2 * M1 * Math.PI) / 180);
	corr -= 0.0004 * Math.sin((3 * M1 * Math.PI) / 180);
	corr += 0.0104 * Math.sin((2 * F * Math.PI) / 180);
	corr -= 0.0051 * Math.sin(((M + M1) * Math.PI) / 180);
	corr -= 0.0074 * Math.sin(((M - M1) * Math.PI) / 180);
	corr += 0.0004 * Math.sin(((2 * F + M) * Math.PI) / 180);
	corr -= 0.0004 * Math.sin(((2 * F - M) * Math.PI) / 180);
	corr -= 0.0006 * Math.sin(((2 * F + M1) * Math.PI) / 180);
	corr += 0.001 * Math.sin(((2 * F - M1) * Math.PI) / 180);
	corr += 0.0005 * Math.sin(((M + 2 * M1) * Math.PI) / 180);
	// Base epoch + synodic month
	let JD =
		2415020.75933 + 29.53058868 * K + 0.0001178 * Math.pow(T, 2) - 0.000000155 * Math.pow(T, 3);
	JD += 0.00033 * Math.sin(((166.56 + 132.87 * T - 0.009173 * Math.pow(T, 2)) * Math.PI) / 180);
	JD += corr;
	return JD;
}

// Round K to nearest half
function roundK(k: number): number {
	if (k >= 0) {
		const f = k - Math.floor(k);
		return f >= 0.5 ? Math.floor(k) + 0.5 : Math.floor(k);
	} else {
		const c = Math.ceil(k);
		const f = c - k;
		return f >= 0.5 ? c + 0.5 : c;
	}
}

// Find prenatal syzygy using Meeus formulas
function findPrenatalSyzygy(jdBirth: number): { jd: number; isFull: boolean } {
	const K0 = calcK(jdBirth);
	const Kbase = roundK(K0);
	const jdNew = calcSyzygyJD(Kbase);
	const jdFull = calcSyzygyJD(Kbase + 0.5);
	if (jdFull <= jdBirth && jdFull > jdNew) {
		return { jd: jdFull, isFull: true };
	}
	return { jd: jdNew, isFull: false };
}

// ── API Handler ─────────────────────────────────────────────────────────────
export async function POST({ request }) {
	try {
		const { date, time, city, country } = await request.json();
		if (!date || !time || !city || !country) {
			throw error(400, 'Missing required fields: date, time, city, or country');
		}

		// Geocode
		const query = `${city}, ${country}`;
		if (!env.OPENCAGE_API_KEY) throw error(500, 'Missing OPENCAGE_API_KEY');
		const geo = await opencage.geocode({ q: query, key: env.OPENCAGE_API_KEY, language: 'pt-PT' });
		if (!geo.results.length) throw error(404, `No location: ${query}`);
		const { lat, lng } = geo.results[0].geometry;

		// Timezone
		const [tz] = geoTz.find(lat, lng);
		if (!tz) throw error(500, 'Could not determine timezone');

		// UTC & Julian Day
		const localTime = dayjs.tz(`${date}T${time}`, tz);
		const utcTime = localTime.utc();
		const jd = sweph.utc_to_jd(
			utcTime.year(),
			utcTime.month() + 1,
			utcTime.date(),
			utcTime.hour(),
			utcTime.minute(),
			utcTime.second(),
			sweph.constants.SE_GREG_CAL
		);
		const jdUT = jd.data[1];

		const flags = sweph.constants.SEFLG_TROPICAL | sweph.constants.SEFLG_SPEED;

		// Sunrise/Sunset
		const { sunrise, sunset } = getSunriseSunsetLocal(date, lat, lng, tz);
		const tomorrow = dayjs.tz(`${date}T00:00:00`, tz).add(1, 'day').format('YYYY-MM-DD');
		const { sunrise: nextSunrise } = getSunriseSunsetLocal(tomorrow, lat, lng, tz);

		const dayNight = localTime.isAfter(sunrise) && localTime.isBefore(sunset) ? 'day' : 'night';

		// Planetary Hour
		const { hourNumber, hourRuler, dayRuler } = getPlanetaryHour(
			localTime,
			sunrise,
			sunset,
			nextSunrise
		);

		// Planetary positions: call  main ephemeris
		const mainEph = computeEphAtJd(jdUT, lat, lng);

		// Houses & Ascendant
		const houseData = sweph.houses_ex2(jdUT, flags, lat, lng, 'B');
		const ascLon = houseData.data.points[0];
		const ascPos = degreesToDms(ascLon);
		const ascSign = getZodiacInfo(ascLon);
		const ascendant = {
			position: ascPos,
			signNumber: ascSign.signNumber,
			signName: ascSign.signName
		};

		// prenatal syzygy
		const { jd: jdSyzygy, isFull } = await findPrenatalSyzygy(jdUT);
		const syzEph = computeEphAtJd(jdSyzygy, lat, lng);
		const moonLon = syzEph.planetPositions.Moon.position.longitude;
		const dms = degreesToDms(moonLon);
		const { signName } = getZodiacInfo(moonLon);

		return json({
			...mainEph,
			dayNight: dayNight,
			dayRuler: dayRuler.toLowerCase(),
			hourRuler: hourRuler.toLowerCase(),
			planetaryHour: hourNumber,
			usedTimezone: tz,
			usedCoordinates: { latitude: lat, longitude: lng },
			utcTime: utcTime.format(),
			prenatalSyzygy: {
				type: isFull ? 'Lua Cheia' : 'Lua Nova',
				degrees: dms.degrees,
				minutes: dms.minutes,
				sign: signName
			}
		});
	} catch (err: any) {
		console.error('Error in /api/ephemeris:', err);
		throw error(500, err.message || 'Internal Error');
	}
}
