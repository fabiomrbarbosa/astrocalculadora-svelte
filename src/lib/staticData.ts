import type {
	Planets,
	Signs,
	Points,
	Aspects,
	HylegicPoints,
	ResourceSignifiers
} from '$lib/types';

export const planets: Planets = {
	moon: {
		value: 'Moon',
		label: 'Lua',
		icon: '☽',
		iconReplacement: 'R',
		orb: 12
	},
	mercury: { value: 'Mercury', label: 'Mercúrio', icon: '☿', iconReplacement: 'S', orb: 7 },
	venus: { value: 'Venus', label: 'Vénus', icon: '♀', iconReplacement: 'T', orb: 7 },
	sun: { value: 'Sun', label: 'Sol', icon: '☉', iconReplacement: 'Q', orb: 15 },
	mars: { value: 'Mars', label: 'Marte', icon: '♂', iconReplacement: 'U', orb: 8 },
	jupiter: { value: 'Jupiter', label: 'Júpiter', icon: '♃', iconReplacement: 'V', orb: 9 },
	saturn: { value: 'Saturn', label: 'Saturno', icon: '♄', iconReplacement: 'W', orb: 9 }
};

export const signs: Signs = {
	aries: {
		value: 'Aries',
		label: 'Carneiro',
		icon: '♈︎',
		iconReplacement: 'A',
		degrees: 0,
		dignities: {
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
		}
	},
	taurus: {
		value: 'Taurus',
		label: 'Touro',
		icon: '♉︎',
		iconReplacement: 'B',
		degrees: 30,
		dignities: {
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
		}
	},
	gemini: {
		value: 'Gemini',
		label: 'Gémeos',
		icon: '♊︎',
		iconReplacement: 'C',
		degrees: 60,
		dignities: {
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
		}
	},
	cancer: {
		value: 'Cancer',
		label: 'Caranguejo',
		icon: '♋︎',
		iconReplacement: 'D',
		degrees: 90,
		dignities: {
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
		}
	},
	leo: {
		value: 'Leo',
		label: 'Leão',
		icon: '♌︎',
		iconReplacement: 'E',
		degrees: 120,
		dignities: {
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
		}
	},
	virgo: {
		value: 'Virgo',
		label: 'Virgem',
		icon: '♍︎',
		iconReplacement: 'F',
		degrees: 150,
		dignities: {
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
		}
	},
	libra: {
		value: 'Libra',
		label: 'Balança',
		icon: '♎︎',
		iconReplacement: 'G',
		degrees: 180,
		dignities: {
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
		}
	},
	scorpio: {
		value: 'Scorpio',
		label: 'Escorpião',
		icon: '♏︎',
		iconReplacement: 'H',
		degrees: 210,
		dignities: {
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
		}
	},
	sagittarius: {
		value: 'Sagittarius',
		label: 'Sagitário',
		icon: '♐︎',
		iconReplacement: 'I',
		degrees: 240,
		dignities: {
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
		}
	},
	capricorn: {
		value: 'Capricorn',
		label: 'Capricórnio',
		icon: '♑︎',
		iconReplacement: 'J',
		degrees: 270,
		dignities: {
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
		}
	},
	aquarius: {
		value: 'Aquarius',
		label: 'Aquário',
		icon: '♒︎',
		iconReplacement: 'K',
		degrees: 300,
		dignities: {
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
		}
	},
	pisces: {
		value: 'Pisces',
		label: 'Peixes',
		icon: '♓︎',
		iconReplacement: 'L',
		degrees: 330,
		dignities: {
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
	}
};

export const points: Points = {
	ascendant: {
		label: 'Ascendente',
		icon: 'ASC',
		iconReplacement: 'c'
	},
	midheaven: {
		label: 'Meio-do-Céu',
		icon: 'ASC',
		iconReplacement: 'd'
	},
	partFortune: {
		label: 'Parte da Fortuna',
		icon: '⊗',
		iconReplacement: '?'
	},
	partSubstance: {
		label: 'Parte da Substância'
	},
	syzygy: {
		label: 'Sizígia Pré-Natal'
	},
	northNode: {
		label: 'Nodo Norte',
		icon: '☊',
		iconReplacement: 'g'
	},
	southNode: {
		label: 'Nodo Sul',
		icon: '☋',
		iconReplacement: 'i'
	}
};

export const houses = {
	house1: { label: '1.ª Casa', cusp: { label: 'Cúspide da 1.ª Casa' } },
	house2: { label: '2.ª Casa', cusp: { label: 'Cúspide da 2.ª Casa' } },
	house3: { label: '3.ª Casa', cusp: { label: 'Cúspide da 3.ª Casa' } },
	house4: { label: '4.ª Casa', cusp: { label: 'Cúspide da 4.ª Casa' } },
	house5: { label: '5.ª Casa', cusp: { label: 'Cúspide da 5.ª Casa' } },
	house6: { label: '6.ª Casa', cusp: { label: 'Cúspide da 6.ª Casa' } },
	house7: { label: '6.ª Casa', cusp: { label: 'Cúspide da 7.ª Casa' } },
	house8: { label: '8.ª Casa', cusp: { label: 'Cúspide da 8.ª Casa' } },
	house9: { label: '9.ª Casa', cusp: { label: 'Cúspide da 9.ª Casa' } },
	house10: { label: '10.ª Casa', cusp: { label: 'Cúspide da 10.ª Casa' } },
	house11: { label: '11.ª Casa', cusp: { label: 'Cúspide da 11.ª Casa' } },
	house12: { label: '12.ª Casa', cusp: { label: 'Cúspide da 12.ª Casa' } }
};

export const aspects: Aspects = {
	conjunction: { name: 'Conjunção', angle: 0, signsApart: [0], icon: '☌', iconReplacement: '!' }, // Same sign
	sextile: { name: 'Sextil', angle: 60, signsApart: [2, 10], icon: '⚹', iconReplacement: '%' }, // Two signs apart (aries-Gemini, aries-Aquarius)
	square: { name: 'Quadratura', angle: 90, signsApart: [3, 9], icon: '□', iconReplacement: '#' }, // Three signs apart (aries-Cancer, aries-Capricorn)
	trine: { name: 'Trígono', angle: 120, signsApart: [4, 8], icon: '△', iconReplacement: '$' }, // Four signs apart (aries-Leo, aries-Sagittarius)
	opposition: { name: 'Oposição', angle: 180, signsApart: [6], icon: '☍', iconReplacement: '"' } // Six signs apart (aries-Libra)
};

export const hylegicPoints: HylegicPoints = {
	sun: { source: 'planets.sun', label: 'Sol' },
	moon: { source: 'planets.moon', label: 'Lua' },
	ascendant: {
		source: 'points.ascendant',
		label: 'Ascendente'
	},
	partFortune: {
		source: 'points.partFortune',
		label: 'Parte da Fortuna'
	},
	syzygy: {
		source: 'points.syzygy',
		label: 'Sizígia Pré-Natal'
	}
};

export const resourceSignifiers: ResourceSignifiers = {
	house2Cusp: {
		source: 'houses.house2.cusp',
		label: 'Cúspide da Casa 2'
	},
	house2Ruler: {
		source: 'houses.house2.ruler',
		label: 'Regente da Casa 2'
	},
	house2Planets: {
		source: 'houses.house2.planets',
		label: 'Planetas na Casa 2'
	},
	partFortune: {
		source: 'points.partFortune',
		label: 'Parte da Fortuna'
	},
	partFortuneDispositor: {
		source: 'partFortuneDispositor',
		label: 'Dispositor da Parte da Fortuna'
	},
	partSubstance: {
		source: 'points.partSubstance',
		label: 'Parte da Substância'
	},
	partSubstanceDispositor: {
		source: 'partSubstanceDispositor',
		label: 'Dispositor da Parte da Substância'
	},
	jupiter: { source: 'planets.jupiter', label: 'Júpiter' }
};
