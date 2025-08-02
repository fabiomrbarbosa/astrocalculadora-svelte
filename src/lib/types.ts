/** Dignities (Rulership, Exaltation, Triplicity, Terms, and Faces) */
export interface Dignities {
	domicile: string;
	exaltation: string;
	triplicities: string[];
	terms: Record<number, string>;
	faces: Record<number, string>;
}

/** Zodiac Sign Object */
export interface Sign {
	value: string;
	label: string;
	icon: string;
	iconReplacement: string;
	degrees: number;
	dignities: Dignities;
}

/** Zodiac Signs Dictionary */
export type Signs = Record<string, Sign>;

/** Aspect Definition */
export interface Aspect {
	name: string;
	angle: number;
	signsApart: number[];
	icon: string;
}

/** List of Aspects */
export type Aspects = Record<string, Aspect>;

/** Hylegic Point */
export interface HylegicPoint {
	source: string;
	label: string;
}

/** List of Hylegic Points */
export type HylegicPoints = Record<string, HylegicPoint>;

/** Resource Signifier */
export interface ResourceSignifier {
	source: string;
	label: string;
}

/** List of Resource Signifiers */
export type ResourceSignifiers = Record<string, ResourceSignifier>;

export type PlanetPosition = {
	position: { degrees: number; minutes: number; longitude: number };
	signName: string;
	retrograde: boolean;
	longitude: number;
};

export type Ascendant = {
	position: { degrees: number; minutes: number };
	signName: string;
};

export type SyncChartInput = {
	meta: Record<string, any>;
	planetPositions: Record<string, PlanetPosition>;
	ascendant: Ascendant;
	houses: number[]; // 12 cusp longitudes in absolute degrees [0–360)
	dayNight?: 'day' | 'night';
	dayRuler?: string;
	hourRuler?: string;
	usedCoordinates?: Record<string, any>;
	usedTimezone?: Record<string, any>;
	prenatalSyzygy?: { type: string; degrees: number; minutes: number; sign: string };
};
