export let metadata = $state({
	activeTab: 'aspects',
	dayNight: 'day',
	maleFemale: 'male',
	rulerOfDay: 'moon',
	rulerOfHour: 'moon'
});

export let planets = $state({
	moon: {
		label: 'Lua',
		icon: '☽',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 12,
		retrograde: false
	},
	mercury: {
		label: 'Mercúrio',
		icon: '☿',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 7,
		retrograde: false
	},
	venus: {
		label: 'Vénus',
		icon: '♀',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 7,
		retrograde: false
	},
	sun: {
		label: 'Sol',
		icon: '☉',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 15,
		retrograde: false
	},
	mars: {
		label: 'Marte',
		icon: '♂',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 8,
		retrograde: false
	},
	jupiter: {
		label: 'Júpiter',
		icon: '♃',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 9,
		retrograde: false
	},
	saturn: {
		label: 'Saturno',
		icon: '♄',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		house: '1',
		orb: 9,
		retrograde: false
	}
});

export let points = $state({
	ascendant: {
		label: 'Ascendente',
		degrees: 0,
		minutes: 0,
		sign: 'aries'
	},
	fortune: {
		label: 'Parte da Fortuna',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		dispositor: 'mars'
	},
	substance: {
		label: 'Parte da Substância',
		degrees: 0,
		minutes: 0,
		sign: 'aries',
		dispositor: 'mars'
	},
	syzygy: {
		label: 'Sizígia Pré-Natal',
		degrees: 0,
		minutes: 0,
		sign: 'aries'
	}
});

export let houses = $state({
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
});

export let signs = $state({
	aries: {
		value: 'Aries',
		label: 'Carneiro',
		icon: '♈︎',
		degrees: 0
	},
	taurus: {
		value: 'Taurus',
		label: 'Touro',
		icon: '♉︎',
		degrees: 30
	},
	gemini: {
		value: 'Gemini',
		label: 'Gémeos',
		icon: '♊︎',
		degrees: 60
	},
	cancer: {
		value: 'Cancer',
		label: 'Caranguejo',
		icon: '♋︎',
		degrees: 90
	},
	leo: {
		value: 'Leo',
		label: 'Leão',
		icon: '♌︎',
		degrees: 120
	},
	virgo: {
		value: 'Virgo',
		label: 'Virgem',
		icon: '♍︎',
		degrees: 150
	},
	libra: {
		value: 'Libra',
		label: 'Balança',
		icon: '♎︎',
		degrees: 180
	},
	scorpio: {
		value: 'Scorpio',
		label: 'Escorpião',
		icon: '♏︎',
		degrees: 210
	},
	sagittarius: {
		value: 'Sagittarius',
		label: 'Sagitário',
		icon: '♐︎',
		degrees: 240
	},
	capricorn: {
		value: 'Capricorn',
		label: 'Capricórnio',
		icon: '♑︎',
		degrees: 270
	},
	aquarius: {
		value: 'Aquarius',
		label: 'Aquário',
		icon: '♒︎',
		degrees: 300
	},
	pisces: {
		value: 'Pisces',
		label: 'Peixes',
		icon: '♓︎',
		degrees: 330
	}
});

export let dignities = $state({
	aries: {
		domicile: 'mars',
		exaltation: 'sun',
		triplicities: ['sun', 'jupiter', 'saturn'],
		terms: {
			0: 'jupiter',
			6: 'venus',
			12: 'mercury',
			20: 'mars',
			25: 'saturn'
		},
		faces: { 0: 'mars', 10: 'sun', 20: 'venus' }
	},
	taurus: {
		domicile: 'venus',
		exaltation: 'moon',
		triplicities: ['venus', 'moon', 'mars'],
		terms: {
			0: 'venus',
			8: 'mercury',
			14: 'jupiter',
			22: 'saturn',
			27: 'mars'
		},
		faces: { 0: 'mercury', 10: 'moon', 20: 'saturn' }
	},
	gemini: {
		domicile: 'mercury',
		exaltation: '',
		triplicities: ['saturn', 'mercury', 'jupiter'],
		terms: {
			0: 'mercury',
			6: 'jupiter',
			12: 'venus',
			17: 'mars',
			24: 'saturn'
		},
		faces: {
			0: 'jupiter',
			10: 'mars',
			20: 'sun'
		}
	},
	cancer: {
		domicile: 'moon',
		exaltation: 'jupiter',
		triplicities: ['venus', 'mars', 'moon'],
		terms: {
			0: 'mars',
			7: 'venus',
			13: 'mercury',
			19: 'jupiter',
			26: 'saturn'
		},
		faces: {
			0: 'venus',
			10: 'mercury',
			20: 'moon'
		}
	},
	leo: {
		domicile: 'sun',
		exaltation: '',
		triplicities: ['sun', 'jupiter', 'saturn'],
		terms: {
			0: 'jupiter',
			6: 'venus',
			11: 'saturn',
			18: 'mercury',
			24: 'mars'
		},
		faces: {
			0: 'saturn',
			10: 'jupiter',
			20: 'mars'
		}
	},
	virgo: {
		domicile: 'mercury',
		exaltation: 'mercury',
		triplicities: ['venus', 'moon', 'mars'],
		terms: {
			0: 'mercury',
			7: 'venus',
			17: 'jupiter',
			21: 'mars',
			28: 'saturn'
		},
		faces: {
			0: 'sun',
			10: 'venus',
			20: 'mercury'
		}
	},
	libra: {
		domicile: 'venus',
		exaltation: 'saturn',
		triplicities: ['saturn', 'mercury', 'jupiter'],
		terms: {
			0: 'saturn',
			6: 'mercury',
			14: 'jupiter',
			21: 'venus',
			28: 'mars'
		},
		faces: {
			0: 'moon',
			10: 'saturn',
			20: 'jupiter'
		}
	},
	scorpio: {
		domicile: 'mars',
		exaltation: '',
		triplicities: ['venus', 'mars', 'moon'],
		terms: {
			0: 'mars',
			7: 'venus',
			11: 'mercury',
			19: 'jupiter',
			24: 'saturn'
		},
		faces: {
			0: 'mars',
			10: 'sun',
			20: 'venus'
		}
	},
	sagittarius: {
		domicile: 'jupiter',
		exaltation: '',
		triplicities: ['sun', 'jupiter', 'saturn'],
		terms: {
			0: 'jupiter',
			12: 'venus',
			17: 'mercury',
			21: 'saturn',
			26: 'mars'
		},
		faces: {
			0: 'mercury',
			10: 'moon',
			20: 'saturn'
		}
	},
	capricorn: {
		domicile: 'saturn',
		exaltation: 'mars',
		triplicities: ['venus', 'moon', 'mars'],
		terms: {
			0: 'mercury',
			7: 'jupiter',
			14: 'venus',
			22: 'saturn',
			26: 'mars'
		},
		faces: {
			0: 'jupiter',
			10: 'mars',
			20: 'sun'
		}
	},
	aquarius: {
		domicile: 'saturn',
		exaltation: '',
		triplicities: ['saturn', 'mercury', 'jupiter'],
		terms: {
			0: 'mercury',
			7: 'venus',
			13: 'jupiter',
			20: 'mars',
			25: 'saturn'
		},
		faces: {
			0: 'venus',
			10: 'mercury',
			20: 'moon'
		}
	},
	pisces: {
		domicile: 'jupiter',
		exaltation: 'venus',
		triplicities: ['venus', 'mars', 'moon'],
		terms: {
			0: 'venus',
			12: 'jupiter',
			16: 'mercury',
			19: 'mars',
			28: 'saturn'
		},
		faces: {
			0: 'saturn',
			10: 'jupiter',
			20: 'mars'
		}
	}
});

export let aspects = $state([
	{ name: 'Conjunção', angle: 0, signsApart: [0], icon: '☌' }, // Same sign
	{ name: 'Sextil', angle: 60, signsApart: [2, 10], icon: '⚹' }, // Two signs apart (aries-Gemini, aries-Aquarius)
	{ name: 'Quadratura', angle: 90, signsApart: [3, 9], icon: '□' }, // Three signs apart (aries-Cancer, aries-Capricorn)
	{ name: 'Trígono', angle: 120, signsApart: [4, 8], icon: '△' }, // Four signs apart (aries-Leo, aries-Sagittarius)
	{ name: 'Oposição', angle: 180, signsApart: [6], icon: '☍' } // Six signs apart (aries-Libra)
]);

export let hylegicPoints = $state([
	{ key: 'sun', source: 'planets.sun', label: 'Sol' },
	{ key: 'moon', source: 'planets.moon', label: 'Lua' },
	{
		key: 'ascendant',
		source: 'points.ascendant',
		label: 'Ascendente'
	},
	{
		key: 'fortune',
		source: 'points.fortune',
		label: 'Parte da Fortuna'
	},
	{
		key: 'syzygy',
		source: 'points.syzygy',
		label: 'Sizígia Pré-Natal'
	}
]);

export let resourceSignifiers = $state([
	{
		key: 'house2_cusp',
		source: 'houses.house2.cusp',
		label: 'Cúspide da Casa 2'
	},
	{
		key: 'house2_ruler',
		source: 'houses.house2.ruler',
		label: 'Regente da Casa 2'
	},
	{
		key: 'house2_planets',
		source: 'houses.house2.planets',
		label: 'Planetas na Casa 2'
	},
	{
		key: 'fortune',
		source: 'points.fortune',
		label: 'Parte da Fortuna'
	},
	{
		key: 'fortune_dispositor',
		source: 'points.fortune.dispositor',
		label: 'Dispositor da Parte da Fortuna'
	},
	{
		key: 'substance',
		source: 'points.substance',
		label: 'Parte da Substância'
	},
	{
		key: 'substance_dispositor',
		source: 'points.substance.dispositor',
		label: 'Dispositor da Parte da Substância'
	},
	{ key: 'jupiter', source: 'planets.jupiter', label: 'Júpiter' }
]);

export let results = $state({
	aspects: [],
	aspectTable: {},
	almutemfiguris: {
		scores: {},
		scoreBreakdown: {
			moon: [],
			mercury: [],
			venus: [],
			sun: [],
			mars: [],
			jupiter: [],
			saturn: []
		},
		dignitySubtotal: {},
		houseScores: {}
	},
	almutemsubstance: {
		scores: {},
		scoreBreakdown: {
			moon: [],
			mercury: [],
			venus: [],
			sun: [],
			mars: [],
			jupiter: [],
			saturn: []
		}
	},
	fortune: '',
	substance: '',
	marriage: '',
	children: '',
	friends: '',
	enemies: '',
	religion: ''
});
