import { signs } from './staticData';
import type { ChartData, ChartInput } from './types';

export let chartInput: ChartInput = $state({
	name: '',
	city: '',
	country: '',
	year: 2000,
	month: 1,
	day: 1,
	hour: 12,
	minute: 0,
	second: 0,
	weekday: '',
	houseSystem: 'B',
	calendar: 'GREG'
});

export let chartData: ChartData = $state({
	meta: {
		name: '',
		year: 2000,
		month: 1,
		weekday: 0,
		day: 1,
		hour: 12,
		minute: 0,
		second: 0,
		utcOffset: '+00:00',
		timezone: 'UTC',
		utcTime: '',
		city: '',
		country: '',
		latitude: 0,
		longitude: 0,
		houseSystem: 'B',
		calendar: 'GREG'
	},
	dayNight: 'day',
	maleFemale: 'male',
	rulerOfDay: 'moon',
	rulerOfHour: 'moon',

	planets: {
		moon: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1
		},
		mercury: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			retrograde: false
		},
		venus: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			retrograde: false
		},
		sun: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1
		},
		mars: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			retrograde: false
		},
		jupiter: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			retrograde: false
		},
		saturn: {
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			retrograde: false
		}
	},

	points: {
		ascendant: {
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		midheaven: {
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		descendant: {
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		imumcoeli: {
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		partFortune: {
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		partSubstance: {
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		syzygy: {
			type: '',
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		}
	},
	houses: {
		house1: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house2: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house3: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house4: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house5: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house6: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house7: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house8: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house9: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house10: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house11: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house12: {
			cusp: { degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		}
	},

	get partFortuneDispositor() {
		return signs[this.points.partFortune.sign]?.dignities.domicile;
	},

	get partSubstanceDispositor() {
		return signs[this.points.partSubstance.sign]?.dignities.domicile;
	},

	results: {
		aspects: [],
		aspectTable: {},
		almutemFiguris: {
			scores: {} as Record<string, number>,
			scoreBreakdown: {} as Record<string, string>,
			dignitySubtotal: {},
			houseScores: {}
		},
		almutemSubstance: {
			scores: {} as Record<string, number>,
			scoreBreakdown: {} as Record<string, string>
		},
		partFortune: '',
		partSubstance: '',
		partMarriage: '',
		partChildren: '',
		partFriends: '',
		partEnemies: '',
		partReligion: ''
	},

	rawEphemeris: null
});
