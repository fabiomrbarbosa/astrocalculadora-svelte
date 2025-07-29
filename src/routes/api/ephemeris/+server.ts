import path from 'path';
import sweph from 'sweph';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { json, error } from '@sveltejs/kit';
import opencage from 'opencage-api-client';
import geoTz from 'geo-tz';
import { OPENCAGE_API_KEY } from '$env/static/private';

dayjs.extend(utc);
dayjs.extend(timezone);

const ephePath = new URL('../../../lib/vendor/ephemeris', import.meta.url).pathname;
sweph.set_ephe_path(ephePath);

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

function getZodiacInfo(degrees: number) {
	const normalized = ((degrees % 360) + 360) % 360;
	const signIndex = Math.floor(normalized / 30);
	return {
		signNumber: signIndex + 1,
		signName: SIGNS[signIndex]
	};
}

function degreesToDms(value: number) {
	const { degree, minute, second } = sweph.split_deg(value, sweph.constants.SE_SPLIT_DEG_ZODIACAL);
	return {
		degrees: degree,
		minutes: minute,
		seconds: second,
		longitude: value
	};
}

function getOppositeLongitude(degrees: number) {
	return (degrees + 180) % 360;
}

export async function POST({ request }) {
	const { date, time, city, country } = await request.json();

	if (!date || !time || !city || !country) {
		throw error(400, 'Missing required fields: date, time, city, or country');
	}

	const locationQuery = `${city}, ${country}`;
	if (!OPENCAGE_API_KEY) throw error(500, 'Missing OPENCAGE_API_KEY');

	// Geocode location
	const geo = await opencage.geocode({ q: locationQuery, key: OPENCAGE_API_KEY });
	if (!geo.results.length) {
		throw error(404, `Could not find location for: ${locationQuery}`);
	}
	const { lat, lng } = geo.results[0].geometry;

	// Find timezone
	const [tz] = geoTz.find(lat, lng);
	if (!tz) throw error(500, 'Could not determine timezone for location');

	// Convert local to UTC
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

	const houseData = sweph.houses_ex2(jdUT, sweph.constants.SEFLG_TROPICAL, lat, lng, 'B');

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
		usedTimezone: tz,
		usedCoordinates: { latitude: lat, longitude: lng },
		utcTime: utcTime.format()
	});
}
