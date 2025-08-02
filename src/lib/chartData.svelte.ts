import { signs } from './staticData';

export type ChartData = {
	meta: {
		name: string;
		year: number;
		month: number;
		day: number;
		hour: number;
		minute: number;
		second: number;
		utcOffset: string; // '+02:00'
		timezone: string; // 'Europe/Berlin'
		latitude: number;
		longitude: number;
		city: string;
		country: string;
		utcTime?: string; // ISO string if needed
	};
	dayNight: string;
	maleFemale: string;
	rulerOfDay: string;
	rulerOfHour: string;
	planets: Record<string, any>; // Allow flexibility
	points: Record<string, any>;
	houses: Record<string, any>;
	results: Record<string, any>; // Loose typing for deep nesting
	partFortuneDispositor: string;
	partSubstanceDispositor: string;
	syzygy?: {
		label: string;
		type: string;
		degrees: number;
		minutes: number;
		sign: string;
	};
	rawEphemeris?: {
		planetPositions: Record<string, any>;
		ascendant: any;
		houses: number[];
		dayNight: 'day' | 'night';
		dayRuler: string;
		hourRuler: string;
		usedCoordinates: Record<string, any>;
		usedTimezone: Record<string, any>;
	} | null;
};

export let chartData: ChartData = $state({
	meta: {
		name: '',
		year: 2000,
		month: 1,
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
		longitude: 0
	},
	dayNight: 'day',
	maleFemale: 'male',
	rulerOfDay: 'moon',
	rulerOfHour: 'moon',

	planets: {
		moon: {
			label: 'Lua',
			icon: '☽',
			iconReplacement: 'R',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 12
		},
		mercury: {
			label: 'Mercúrio',
			icon: '☿',
			iconReplacement: 'S',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 7,
			retrograde: false
		},
		venus: {
			label: 'Vénus',
			icon: '♀',
			iconReplacement: 'T',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 7,
			retrograde: false
		},
		sun: {
			label: 'Sol',
			icon: '☉',
			iconReplacement: 'Q',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 15
		},
		mars: {
			label: 'Marte',
			icon: '♂',
			iconReplacement: 'U',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 8,
			retrograde: false
		},
		jupiter: {
			label: 'Júpiter',
			icon: '♃',
			iconReplacement: 'V',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 9,
			retrograde: false
		},
		saturn: {
			label: 'Saturno',
			icon: '♄',
			iconReplacement: 'W',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 9,
			retrograde: false
		}
	},

	points: {
		ascendant: {
			label: 'Ascendente',
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		partFortune: {
			label: 'Parte da Fortuna',
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		partSubstance: {
			label: 'Parte da Substância',
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		},
		syzygy: {
			label: 'Sizígia Pré-Natal',
			type: '',
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		}
	},
	houses: {
		house1: {
			cusp: { label: 'Cúspide da 1ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house2: {
			cusp: { label: 'Cúspide da 2ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house3: {
			cusp: { label: 'Cúspide da 3ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house4: {
			cusp: { label: 'Cúspide da 4ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house5: {
			cusp: { label: 'Cúspide da 5ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house6: {
			cusp: { label: 'Cúspide da 6ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house7: {
			cusp: { label: 'Cúspide da 7ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house8: {
			cusp: { label: 'Cúspide da 8ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house9: {
			cusp: { label: 'Cúspide da 9ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house10: {
			cusp: { label: 'Cúspide da 10ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house11: {
			cusp: { label: 'Cúspide da 11ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		},
		house12: {
			cusp: { label: 'Cúspide da 12ª Casa', degrees: 0, minutes: 0, sign: 'aries' },
			ruler: 'moon',
			planets: []
		}
	},

	syzygy: {
		label: '',
		type: '',
		degrees: 0,
		minutes: 0,
		sign: 'aries'
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
