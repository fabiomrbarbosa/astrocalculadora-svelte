/** Chart Data type **/
export type ChartInput = {
	name: string;
	city: string;
	country: string;
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	houseSystem: string;
	calendar: string;
};

export type ChartData = {
	meta: {
		name: string;
		year: number;
		month: number;
		weekday: number;
		day: number;
		hour: number;
		minute: number;
		second: number;
		utcTime?: string; // ISO string if needed
		utcOffset: string; // '+02:00'
		timezone: string; // 'Europe/Berlin'
		latitude: number;
		longitude: number;
		city: string;
		country: string;
		houseSystem: string;
		calendar: string;
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
	rawEphemeris?: {
		meta: any;
		planetPositions: Record<string, any>;
		ascendant: any;
		midheaven: any;
		partOfFortune: any;
		prenatalSyzygy: any;
		houses: number[];
		dayNight: 'day' | 'night';
		dayRuler: string;
		hourRuler: string;
		usedCoordinates: Record<string, any>;
		usedTimezone: TimezoneInfo;
	} | null;
};

export type TimezoneInfo = {
	name: string; // timezone identifier, e.g. 'Europe/Berlin'
	offset: string; // offset from UTC in hours, e.g. +02:00 or -05:00
};

/** Dignities (Rulership, Exaltation, Triplicity, Terms, and Faces) */
export interface Dignities {
	domicile: string;
	exaltation: string;
	triplicities: string[];
	terms: Record<number, string>;
	faces: Record<number, string>;
}

/** Planet Object */
export interface Planet {
	value: string;
	label: string;
	icon: string;
	iconReplacement: string;
	orb: number;
}

/** Planet Dictionary */
export type Planets = Record<string, Planet>;

/** Other points */

export interface Point {
	label: string;
	icon?: string;
	iconReplacement?: string;
}

/** Points Dictionary */
export type Points = Record<string, Point>;

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
	iconReplacement: string;
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

/** Aspect Result */
export interface AspectResult {
	planet1: string;
	planet2: string;
	aspect: string;
	icon: string;
	orb: string;
	applying: string;
	outOfSign: boolean;
}

/** House Systems */
export interface HouseSystem {
	code: string;
	name: string;
}

/** House Systems dictionary  */
export type HouseSystems = Record<string, HouseSystem>;

/** Unified Planet Position for Birth Chart rendering */
export type UnifiedPlanetPosition =
	| PlanetPosition
	| {
			position: { degrees: number; minutes: number; longitude: number };
			signNumber: number;
			signName: string;
			retrograde?: boolean;
	  };

export type PlanetPosition = {
	position: { degrees: number; minutes: number; longitude: number };
	signName: string;
	retrograde: boolean;
	longitude: number;
};

export type Angle = {
	position: { degrees: number; minutes: number };
	signName: string;
};

export type SyncChartInput = {
	meta: Record<string, any>;
	planetPositions: Record<string, PlanetPosition>;
	ascendant: Angle;
	midheaven: Angle;
	partOfFortune: {
		position: {
			degrees: number;
			minutes: number;
			seconds: number;
			longitude: number;
		};
		signNumber: number;
		signName: string;
	};
	houses: number[]; // 12 cusp longitudes in absolute degrees [0–360)
	dayNight?: 'day' | 'night';
	dayRuler?: string;
	hourRuler?: string;
	usedCoordinates?: Record<string, any>;
	usedTimezone?: TimezoneInfo;
	prenatalSyzygy?: { type: string; degrees: number; minutes: number; sign: string };
	houseSystem: string;
};
