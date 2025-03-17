import type { Signs, Aspects, HylegicPoints, ResourceSignifiers } from '$lib/types';
export const signs: Signs = {
	aries: {
		value: 'Aries',
		label: 'Carneiro',
		icon: '♈︎',
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

export const aspects: Aspects = {
	conjunction: { name: 'Conjunção', angle: 0, signsApart: [0], icon: '☌' }, // Same sign
	sextile: { name: 'Sextil', angle: 60, signsApart: [2, 10], icon: '⚹' }, // Two signs apart (aries-Gemini, aries-Aquarius)
	square: { name: 'Quadratura', angle: 90, signsApart: [3, 9], icon: '□' }, // Three signs apart (aries-Cancer, aries-Capricorn)
	trine: { name: 'Trígono', angle: 120, signsApart: [4, 8], icon: '△' }, // Four signs apart (aries-Leo, aries-Sagittarius)
	opposition: { name: 'Oposição', angle: 180, signsApart: [6], icon: '☍' } // Six signs apart (aries-Libra)
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
		source: 'points.partFortune.dispositor',
		label: 'Dispositor da Parte da Fortuna'
	},
	partSubstance: {
		source: 'points.partSubstance',
		label: 'Parte da Substância'
	},
	partSubstanceDispositor: {
		source: 'points.partSubstance.dispositor',
		label: 'Dispositor da Parte da Substância'
	},
	jupiter: { source: 'planets.jupiter', label: 'Júpiter' }
};
