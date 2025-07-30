import path from 'path';
import sweph from 'sweph';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
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
	NorthNode: sweph.constants.SE_MEAN_NODE,
	SouthNode: sweph.constants.SE_MEAN_NODE
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

// ── Sunrise/Sunset helpers using `sunrise-sunset-js` ─────────────────────────
/**
 * Returns local sunrise & sunset for isoDate (YYYY-MM-DD) at lat/lng in tz
 */
function getSunriseSunsetLocal(isoDate: string, lat: number, lng: number, tz: string) {
	// Parse ISO date components
	const [year, month, day] = isoDate.split('-').map(Number);
	// Construct JS Date (month is zero-based)
	const dateObj = new Date(year, month - 1, day);
	// getSunrise/getSunset accept (lat, lng) or (lat, lng, date)
	const sunriseDt = getSunrise(lat, lng, dateObj);
	const sunsetDt = getSunset(lat, lng, dateObj);
	return {
		sunrise: dayjs(sunriseDt).tz(tz),
		sunset: dayjs(sunsetDt).tz(tz)
	};
}

// ── Planetary Hour helper ───────────────────────────────────────────────────
const CHALDEAN = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
const DAY_RULER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

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
	let segment: number;
	let sinceMs: number;
	let cycleDay: number;

	if (localTime.isAfter(sunrise) && localTime.isBefore(sunset)) {
		isDay = true;
		segment = sunset.diff(sunrise) / 12;
		sinceMs = localTime.diff(sunrise);
		cycleDay = localTime.day();
	} else {
		isDay = false;
		if (localTime.isBefore(sunrise)) {
			const prevSet = sunset.subtract(1, 'day');
			segment = sunrise.diff(prevSet) / 12;
			sinceMs = localTime.diff(prevSet);
			cycleDay = sunrise.subtract(1, 'day').day();
		} else {
			segment = nextRise.diff(sunset) / 12;
			sinceMs = localTime.diff(sunset);
			cycleDay = localTime.day();
		}
	}

	const idx = Math.floor(sinceMs / segment); // 0–11
	const hourNumber = isDay ? idx + 1 : idx + 13; // 1–24

	const startIdx = CHALDEAN.indexOf(DAY_RULER[cycleDay]);
	const planetIdx = (startIdx + (hourNumber - 1)) % CHALDEAN.length;

	return {
		hourNumber,
		hourRuler: CHALDEAN[planetIdx],
		dayRuler: DAY_RULER[cycleDay]
	};
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
		const utcTime = dayjs.tz(`${date}T${time}`, tz).utc();
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
		// Use isAfter/isBefore instead of isBetween plugin
		const dayNight = utcTime.isAfter(sunrise) && utcTime.isBefore(sunset) ? 'day' : 'night';

		// Planetary Hour
		const localTime = dayjs.tz(`${date}T${time}`, tz);
		const { hourNumber, hourRuler, dayRuler } = getPlanetaryHour(
			localTime,
			sunrise,
			sunset,
			nextSunrise
		);

		// Planetary positions
		const planetPositions: Record<string, any> = {};

		for (const [planet, code] of Object.entries(PLANETS)) {
			const result = sweph.calc_ut(jdUT, code, flags);

			if (!result.error) {
				let lon = result.data[0];
				let speed = result.data[3];

				if (planet === 'SouthNode') {
					lon = getOppositeLongitude(lon);
					speed = -speed;
				}

				const position = degreesToDms(lon);
				const signInfo = getZodiacInfo(lon);

				planetPositions[planet] = {
					position,
					retrograde: speed < 0,
					signNumber: signInfo.signNumber,
					signName: signInfo.signName
				};
			}
		}

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

		return json({
			planetPositions,
			ascendant,
			houses: houseData.data.houses,
			dayNight: dayNight,
			dayRuler: dayRuler.toLowerCase(),
			hourRuler: hourRuler.toLowerCase(),
			planetaryHour: hourNumber,
			usedTimezone: tz,
			usedCoordinates: { latitude: lat, longitude: lng },
			utcTime: utcTime.format()
		});
	} catch (err: any) {
		console.error('Error in /api/ephemeris:', err);
		throw error(500, err.message || 'Internal Error');
	}
}
