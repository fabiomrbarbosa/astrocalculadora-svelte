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
