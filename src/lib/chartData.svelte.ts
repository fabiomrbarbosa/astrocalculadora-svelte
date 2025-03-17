import { signs } from './staticData';

export type ChartData = {
	activeTab: string;
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
};

export let chartData: ChartData = $state({
	activeTab: 'aspects',
	dayNight: 'day',
	maleFemale: 'male',
	rulerOfDay: 'moon',
	rulerOfHour: 'moon',

	planets: {
		moon: {
			label: 'Lua',
			icon: '☽',
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 12
		},
		mercury: {
			label: 'Mercúrio',
			icon: '☿',
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
			degrees: 0,
			minutes: 0,
			sign: 'aries',
			house: 1,
			orb: 15
		},
		mars: {
			label: 'Marte',
			icon: '♂',
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
			degrees: 0,
			minutes: 0,
			sign: 'aries'
		}
	},

	houses: {
		house2: {
			cusp: {
				label: 'Cúspide da 2ª Casa',
				degrees: 0,
				minutes: 0,
				sign: 'aries'
			},
			ruler: 'moon',
			planets: []
		},
		house12: {
			cusp: {
				label: 'Cúspide da 12ª Casa',
				degrees: 0,
				minutes: 0,
				sign: 'aries'
			},
			ruler: 'moon'
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
	}
});
